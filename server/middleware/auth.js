import jwt from "jsonwebtoken";
import User from "~/server/models/User";
import Role from "~/server/models/Role";

// کش ساده برای کاربران
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default defineEventHandler(async (event) => {
  // console.log("🟡 Middleware Hit:", event.node.req.url);
  // console.log("🟡 Cookies:", getCookie(event, "token"));

  // فقط برای API routes که نیاز به auth دارند
  if (!event.node.req.url?.startsWith("/api/")) {
    return;
  }

  // routes که نیاز به auth ندارند
  const publicRoutes = ["/api/auth/login", "/api/auth/register"];
  if (publicRoutes.includes(event.node.req.url)) {
    return;
  }

  const token = getCookie(event, "token");
  const config = useRuntimeConfig();

  if (!token) {
    throw createError({ statusCode: 401, message: "توکن یافت نشد" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userId = decoded._id;

    // بررسی کش
    const cachedUser = userCache.get(userId);
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_TTL) {
      console.log("📋 Using cached user data");
      event.context.user = cachedUser.data;
      return;
    }

    // تلاش برای دریافت از دیتابیس با timeout کمتر
    try {
      const user = await Promise.race([
        User.findById(userId).populate("role").lean(), // lean() برای سرعت بیشتر
        new Promise(
          (_, reject) =>
            setTimeout(() => reject(new Error("Database query timeout")), 2000) // کاهش timeout
        ),
      ]);

      if (user) {
        const userData = {
          _id: user._id,
          username: user.username,
          role: user.role.name,
          permissions: user.role.permissions,
        };

        // ذخیره در کش
        userCache.set(userId, {
          data: userData,
          timestamp: Date.now(),
        });

        event.context.user = userData;
        // console.log("✅ User loaded from database");
        return;
      }
    } catch (dbError) {
      console.error("🔴 Database Error:", dbError.message);
    }

    // fallback: استفاده از اطلاعات JWT
    const fallbackUser = {
      _id: decoded._id,
      role: decoded.role,
      permissions: [], // یا مقادیر پیش‌فرض
    };

    // کش کردن fallback data
    userCache.set(userId, {
      data: fallbackUser,
      timestamp: Date.now(),
    });

    event.context.user = fallbackUser;
    // console.log("⚠️ Using JWT data due to DB issue");
  } catch (err) {
    console.error("🔴 JWT Error:", err.message);
    throw createError({ statusCode: 401, message: "توکن نامعتبر است" });
  }
});
