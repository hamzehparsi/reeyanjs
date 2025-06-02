
export default defineNuxtPlugin(async (nuxtApp) => {
  let auth_user = useAuth(); // گرفتن مقدار reactive از store

  try {
    const response = await $fetch("/api/auth/me", {
      // headers: useRequestHeaders(["cookie"]), // ارسال کوکی برای دریافت کاربر
      credentials: "include",
    });
    console.log(response);
    // console.log(response);
    
    // if (response?.user) {
    //   auth_user.value = response.user; // مقداردهی `auth_user`
    //   // console.log("✅ User authenticated:", auth_user.value);
    // } else {
    //   auth_user.value = null;
    //   // console.warn("⚠️ No user data found.");
    // }
  } catch (error) {
    auth_user.value = null;
    // console.error("❌ Auth error:", error);
  }
});
