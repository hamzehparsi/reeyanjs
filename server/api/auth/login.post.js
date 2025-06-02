import { connectDB } from "~/server/utils/db";
import User from "~/server/models/User";
import Role from "~/server/models/Role";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: "نام کاربری و رمز عبور الزامی است",
      })
    );
  }

  const user = await User.findOne({ username }).populate("role");
  if (!user) {
    return sendError(
      event,
      createError({ statusCode: 404, message: "کاربر یافت نشد" })
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(
      event,
      createError({ statusCode: 401, message: "رمز اشتباه است" })
    );
  }

  const token = jwt.sign(
    {
      _id: user._id,
      role: user.role.name,
    },
    useRuntimeConfig().JWT_SECRET,
    { expiresIn: "1d" }
  );

  setCookie(event, "token", token, {
    httpOnly: true,
    sameSite: true,
    maxAge: 60 * 60 * 24, // 1 روز
  });

  return { message: "ورود موفق بود ✅", user: user };
});
