import jwt from "jsonwebtoken";
import User from "~/server/models/User";
import Role from "~/server/models/Role";

export default defineEventHandler(async (event) => {
  // فقط برای API routes که نیاز به auth دارند
  if (!event.node.req.url?.startsWith('/api/')) {
    return;
  }

  // routes که نیاز به auth ندارند
  const publicRoutes = ['/api/auth/login', '/api/auth/register'];
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

    const user = await User.findById(decoded.userId).populate("role");
    if (!user) {
      throw createError({ statusCode: 401, message: "کاربر معتبر نیست" });
    }

    // ذخیره در event.context برای استفاده در route
    event.context.user = {
      _id: user._id,
      username: user.username,
      role: user.role.name,
      permissions: user.role.permissions,
    };
  } catch (err) {
    throw createError({ statusCode: 401, message: "توکن نامعتبر است" });
  }
});