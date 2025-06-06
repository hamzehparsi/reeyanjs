export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token");

  // اگر توکن وجود داره، اجازه نده به صفحات setup یا login بره
  if (
    token.value &&
    ["/admin/auth/register", "/admin/auth/login"].includes(to.path)
  ) {
    return navigateTo("/admin");
  }
});
