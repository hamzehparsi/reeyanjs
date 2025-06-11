// server/api/entries/[collectionName].post.js
import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName } = event.context.params
  const body = await readBody(event)
  try {
    const Model = await getModelByName(collectionName)
    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const entry = await Model.create(body)

    return {
      message: 'محتوا با موفقیت ایجاد شد',
      entry,
    }
  } catch (err) {
    console.error('❌ خطا در ایجاد محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در ایجاد محتوا',
    })
  }
})
