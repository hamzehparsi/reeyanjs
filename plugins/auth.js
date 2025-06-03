export default defineNuxtPlugin(async () => {
  const auth_user = useAuth();

  // اگر قبلاً مقداردهی شده، ادامه نده
  if (auth_user.value) return;

  // بررسی کش در سمت کلاینت
  if (process.client) {
    const cachedUser = sessionStorage.getItem('auth_user');
    if (cachedUser) {
      try {
        auth_user.value = JSON.parse(cachedUser);
        return;
      } catch {
        sessionStorage.removeItem('auth_user');
      }
    }
  }

  try {
    const headers = useRequestHeaders(["cookie"]);

    const response = await $fetch("/api/auth/me", {
      credentials: "include",
      headers,
      timeout: 5000,
    });

    auth_user.value = response.user;

    // ذخیره در کش کلاینت
    if (process.client) {
      sessionStorage.setItem('auth_user', JSON.stringify(response.user));
    }

  } catch {
    auth_user.value = null;
    if (process.client) {
      sessionStorage.removeItem('auth_user');
    }
  }
});
