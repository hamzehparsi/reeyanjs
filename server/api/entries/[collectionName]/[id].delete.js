// server/api/entries/[collectionName]/[id].delete.js
import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName, id } = event.context.params

  try {
    const Model = await getModelByName(collectionName)
    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const deleted = await Model.findByIdAndDelete(id)

    if (!deleted) {
      throw createError({ statusCode: 404, message: 'محتوا برای حذف یافت نشد' })
    }

    return {
      message: 'محتوا با موفقیت حذف شد',
      entry: deleted,
    }
  } catch (err) {
    console.error('❌ خطا در حذف محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در حذف محتوا',
    })
  }
})
