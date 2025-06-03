export default defineNuxtRouteMiddleware(() => {
  const auth_user = useAuth()

  if (!auth_user.value) {
    return navigateTo('/admin/auth/login')
  }
})
