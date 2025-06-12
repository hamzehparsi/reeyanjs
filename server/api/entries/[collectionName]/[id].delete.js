// server/api/entries/[collectionName]/[id].delete.js
import mongoose from 'mongoose'
import { getModelByName } from '~/server/utils/model-factory'

export default defineEventHandler(async (event) => {
  const { collectionName, id } = event.context.params
  
  try {
    // 1. بررسی اتصال به دیتابیس
    if (mongoose.connection.readyState !== 1) {
      throw createError({ 
        statusCode: 500, 
        message: 'اتصال به دیتابیس برقرار نیست' 
      })
    }

    // 2. دریافت مدل
    const Model = await getModelByName(collectionName)
    if (!Model) {
      throw createError({ 
        statusCode: 404, 
        message: `مدل ${collectionName} یافت نشد` 
      })
    }

    // 3. بررسی معتبر بودن ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError({ 
        statusCode: 400, 
        message: 'شناسه معتبر نیست' 
      })
    }

    // 4. حذف سند
    const deleted = await Model.findByIdAndDelete(id)
    if (!deleted) {
      throw createError({ 
        statusCode: 404, 
        message: 'محتوا با این شناسه یافت نشد' 
      })
    }

    return { 
      success: true,
      message: 'محتوا با موفقیت حذف شد',
      data: deleted
    }

  } catch (err) {
    console.error('❌ خطا در حذف محتوا:', err)
    
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'خطا در حذف محتوا',
      data: {
        collectionName,
        id,
        error: err.message
      }
    })
  }
})