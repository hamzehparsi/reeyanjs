import { connectDB } from '~/server/utils/db'
import Role from '~/server/models/Role'
import User from '~/server/models/User'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  await connectDB()

  const usersCount = await User.countDocuments()
  if (usersCount > 0) {
    return sendError(event, createError({ statusCode: 400, message: 'سوپر ادمین از قبل وجود دارد' }))
  }

  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    return sendError(event, createError({ statusCode: 400, message: 'نام کاربری و رمز عبور الزامی است' }))
  }

  // ساخت نقش admin اگر وجود نداشت
  let adminRole = await Role.findOne({ name: 'admin' })
  if (!adminRole) {
    adminRole = await Role.create({ name: 'admin', permissions: ['*'] }) // همه دسترسی‌ها
  }

  // ساخت یوزر admin
  const hashedPassword = await bcrypt.hash(password, 10)
  await User.create({
    username,
    password: hashedPassword,
    role: adminRole._id
  })

  return { message: '✅ ادمین با موفقیت ایجاد گردید' }
})
