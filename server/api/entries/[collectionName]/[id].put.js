import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName, id } = event.context.params
  const body = await readBody(event)

  try {
    const Model = await getModelByName(collectionName)

    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const updated = await Model.findByIdAndUpdate(id, body, { new: true })

    if (!updated) {
      throw createError({ statusCode: 404, message: 'محتوا یافت نشد' })
    }

    return {
      message: 'محتوا با موفقیت ویرایش شد',
      entry: updated,
    }
  } catch (err) {
    console.error('❌ خطا در ویرایش محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در ویرایش محتوا',
    })
  }
})
