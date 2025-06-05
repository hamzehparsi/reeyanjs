import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName } = event.context.params

  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, message: 'متد مجاز نیست' })
  }

  const body = await readBody(event)

  try {
    const Model = await getModelByName(collectionName)

    if (!Model) {
      throw createError({ statusCode: 404, message: 'مدل یافت نشد' })
    }

    const newEntry = new Model(body)
    await newEntry.save()

    return {
      message: 'محتوا با موفقیت ایجاد شد',
      entry: newEntry,
    }
  } catch (err) {
    console.error('❌ خطا در ایجاد محتوا:', err.message)
    throw createError({
      statusCode: 500,
      message: 'خطا در ایجاد محتوا',
    })
  }
})
