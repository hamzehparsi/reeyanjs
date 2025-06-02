import { connectDB } from "~/server/utils/db";
import User from "~/server/models/User";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server && to.path !== "/admin/auth/register") {
    await connectDB();
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      return navigateTo("/admin/auth/register");
    }
  }
});
