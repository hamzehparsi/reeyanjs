import mongoose from "mongoose";
import ContentType from "~/server/models/ContentType";
import Media from "~/server/models/Media";

// Cache برای مدل‌ها
export const modelCache = {};

// لاگر برای دیباگ
const log = (message, level = 'info') => {
  const colors = {
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    success: '\x1b[32m' // Green
  };
  console.log(`${colors[level]}[model-factory] ${message}\x1b[0m`);
};

/**
 * ساخت یا بازیابی مدل Mongoose بر اساس نام collection
 * @param {string} collectionName - نام collection
 * @returns {mongoose.Model} - مدل Mongoose
 */
export async function getModelByName(collectionName) {
  try {
    // 1. بررسی cache
    if (modelCache[collectionName]) {
      log(`مدل ${collectionName} از cache بازیابی شد`, 'success');
      return modelCache[collectionName];
    }

    // 2. بررسی مدل‌های موجود در Mongoose
    if (mongoose.models[collectionName]) {
      log(`مدل ${collectionName} از mongoose بازیابی شد`, 'info');
      modelCache[collectionName] = mongoose.models[collectionName];
      return mongoose.models[collectionName];
    }

    log(`جستجوی ContentType برای ${collectionName}...`, 'info');

    // 3. پیدا کردن ContentType مربوطه
    const contentType = await ContentType.findOne({ collectionName }).lean();
    if (!contentType) {
      log(`ContentType برای ${collectionName} یافت نشد`, 'warn');
      return null;
    }

    log(`ساخت مدل جدید برای ${collectionName}`, 'info');

    // 4. ساخت schema بر اساس فیلدهای تعریف شده
    const schemaDefinition = {};
    const fields = contentType.fields || [];

    fields.forEach(field => {
      switch (field.type) {
        case "text":
        case "textarea":
        case "select":
          schemaDefinition[field.name] = { type: String };
          break;
        case "number":
          schemaDefinition[field.name] = { type: Number };
          break;
        case "date":
          schemaDefinition[field.name] = { type: Date };
          break;
        case "multiSelect":
          schemaDefinition[field.name] = [{ type: String }];
          break;
        case "media":
          schemaDefinition[field.name] = field.allowMultiple
            ? [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }]
            : { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: false };
          break;
        case "boolean":
          schemaDefinition[field.name] = { type: Boolean };
          break;
        case "richText":
          schemaDefinition[field.name] = { type: mongoose.Schema.Types.Mixed };
          break;
        default:
          schemaDefinition[field.name] = { type: String };
      }

      // اضافه کردن required اگر تعریف شده باشد
      if (field.required) {
        schemaDefinition[field.name].required = true;
      }

      // اضافه کردن default value اگر وجود داشته باشد
      if (field.defaultValue !== undefined) {
        schemaDefinition[field.name].default = field.defaultValue;
      }
    });

    // 5. افزودن فیلدهای سیستمی
    schemaDefinition.createdAt = { type: Date, default: Date.now };
    schemaDefinition.updatedAt = { type: Date, default: Date.now };

    // 6. ساخت schema
    const schema = new mongoose.Schema(schemaDefinition, {
      timestamps: true,
      collection: collectionName,
      strict: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    // 7. افزودن ایندکس‌ها
    if (contentType.indexes) {
      contentType.indexes.forEach(index => {
        schema.index(index.fields, index.options);
      });
    }

    // 8. ثبت مدل
    const Model = mongoose.model(collectionName, schema, collectionName);
    modelCache[collectionName] = Model;

    log(`مدل ${collectionName} با موفقیت ساخته و ثبت شد`, 'success');
    return Model;

  } catch (error) {
    log(`خطا در ساخت مدل ${collectionName}: ${error.message}`, 'error');
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

/**
 * پاک کردن cache مدل‌ها
 */
export function clearModelCache() {
  Object.keys(modelCache).forEach(key => {
    delete modelCache[key];
  });
  log('تمامی مدل‌ها از cache پاک شدند', 'warn');
}

/**
 * بررسی اتصال به دیتابیس
 */
export function checkDatabaseConnection() {
  const states = {
    0: 'قطع',
    1: 'متصل',
    2: 'در حال اتصال',
    3: 'در حال قطع',
    99: 'وضعیت نامعلوم'
  };
  const state = mongoose.connection.readyState;
  log(`وضعیت اتصال دیتابیس: ${states[state] || states[99]} (${state})`, 
      state === 1 ? 'success' : 'error');
  return state === 1;
}