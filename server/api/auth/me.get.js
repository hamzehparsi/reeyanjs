import auth from '~/server/middleware/auth'

export default defineEventHandler(async (event) => {
  await auth(event) // اجرا کردن middleware

  return {
    user: event.context.user
  }
})
