export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({ statusCode: 401, message: "کاربر یافت نشد" });
  }

  return { user };
});
