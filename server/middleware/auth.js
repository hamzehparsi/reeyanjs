import jwt from 'jsonwebtoken'
import { getCookie } from 'h3'
import User from '~/server/models/User'
import Role from '~/server/models/Role'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const config = useRuntimeConfig()

  if (!token) {
    throw createError({ statusCode: 401, message: 'توکن یافت نشد' })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)

    const user = await User.findById(decoded.userId).populate('role')
    if (!user) {
      throw createError({ statusCode: 401, message: 'کاربر معتبر نیست' })
    }

    // ذخیره در event.context برای استفاده در route
    event.context.user = {
      _id: user._id,
      username: user.username,
      role: user.role.name,
      permissions: user.role.permissions
    }

  } catch (err) {
throw createError({ statusCode: 401, message: 'توکن یافت نشد' })
  }
})
