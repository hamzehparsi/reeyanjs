export default defineNuxtRouteMiddleware(() => {
  const user = useCookie('user') // فرض بر اینکه اطلاعات نقش توی کوکی ذخیره شده

  if (!user.value || user.value.role !== 'admin') {
    return navigateTo('/admin/unauthorized') // یا یک پیام یا صفحه خاص
  }
})
