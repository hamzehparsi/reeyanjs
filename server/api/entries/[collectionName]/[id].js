import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName, id } = event.context.params
  
  try {
    const Model = await getModelByName(collectionName)
    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const entry = await Model.findById(id).lean().exec()
    if (!entry) {
      throw createError({ statusCode: 404, message: 'محتوا یافت نشد' })
    }

    // تبدیل _id به id و حذف فیلدهای سیستمی
    const { _id, __v, createdAt, updatedAt, ...cleanedData } = entry
    return { id: _id.toString(), ...cleanedData }
  } catch (err) {
    console.error('❌ خطا در دریافت محتوا:', err)
    throw createError({
      statusCode: 500,
      message: 'خطا در دریافت محتوا',
    })
  }
})