import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName } = event.context.params

  try {
    const Model = await getModelByName(collectionName)

    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const entries = await Model.find().sort({ createdAt: -1 }).lean()

    return {
      message: 'لیست محتوا',
      entries,
    }
  } catch (err) {
    console.error('❌ خطا در دریافت محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در دریافت محتوا',
    })
  }
})
