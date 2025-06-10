export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token");
  const auth_user = useAuth();

  // اگر توکن وجود داره، اجازه نده به صفحات setup یا login بره
  if (
    auth_user.value &&
    ["/admin/auth/register", "/admin/auth/login"].includes(to.path)
  ) {
    return navigateTo("/admin");
  }
});
