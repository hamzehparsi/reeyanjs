import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName, id } = event.context.params

  try {
    const Model = await getModelByName(collectionName)

    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const entry = await Model.findById(id)

    if (!entry) {
      throw createError({ statusCode: 404, message: 'محتوا یافت نشد' })
    }

    return {
      message: 'محتوا با موفقیت دریافت شد',
      entry,
    }
  } catch (err) {
    console.error('❌ خطا در دریافت محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در دریافت محتوا',
    })
  }
})
