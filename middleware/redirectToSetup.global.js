import { connectDB } from '~/server/utils/db'
import User from '~/server/models/User'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server && to.path !== '/admin/setup') {
    await connectDB()
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      return navigateTo('/admin/setup')
    }
  }
})
