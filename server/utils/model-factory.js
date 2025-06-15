import mongoose from "mongoose";
import ContentType from "~/server/models/ContentType";
import Media from "~/server/models/Media";

export const modelCache = {};

const log = (message, level = 'info') => {
  const colors = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    success: '\x1b[32m'
  };
  console.log(`${colors[level]}[model-factory] ${message}\x1b[0m`);
};

export async function getModelByName(collectionName) {
  try {
    if (modelCache[collectionName]) {
      log(`مدل ${collectionName} از cache بازیابی شد`, 'success');
      return modelCache[collectionName];
    }

    if (mongoose.models[collectionName]) {
      log(`مدل ${collectionName} از mongoose بازیابی شد`, 'info');
      modelCache[collectionName] = mongoose.models[collectionName];
      return mongoose.models[collectionName];
    }

    log(`جستجوی ContentType برای ${collectionName}...`, 'info');

    const contentType = await ContentType.findOne({ collectionName }).lean();
    if (!contentType) {
      log(`ContentType برای ${collectionName} یافت نشد`, 'warn');
      return null;
    }

    log(`ساخت مدل جدید برای ${collectionName}`, 'info');

    const schemaDefinition = {};
    const fields = contentType.fields || [];

    fields.forEach(field => {
      switch (field.type) {
        case "shortText":
        case "longText":
        case "select":
        case "richText":
          schemaDefinition[field.name] = { type: String };
          break;
        case "number":
          schemaDefinition[field.name] = { type: Number };
          break;
        case "date":
          schemaDefinition[field.name] = { type: Date };
          break;
        case "boolean":
          schemaDefinition[field.name] = { type: Boolean };
          break;
        case "media":
          if (field.allowMultiple) {
            schemaDefinition[field.name] = [{ 
              type: mongoose.Schema.Types.ObjectId, 
              ref: "Media" 
            }];
          } else {
            schemaDefinition[field.name] = { 
              type: mongoose.Schema.Types.ObjectId, 
              ref: "Media",
              required: field.required || false
            };
          }
          break;
        default:
          schemaDefinition[field.name] = { type: String };
      }

      if (field.required) {
        schemaDefinition[field.name].required = true;
      }

      if (field.defaultValue !== undefined) {
        schemaDefinition[field.name].default = field.defaultValue;
      }
    });

    schemaDefinition.createdAt = { type: Date, default: Date.now };
    schemaDefinition.updatedAt = { type: Date, default: Date.now };

    const schema = new mongoose.Schema(schemaDefinition, {
      timestamps: true,
      collection: collectionName,
      strict: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    if (contentType.indexes) {
      contentType.indexes.forEach(index => {
        schema.index(index.fields, index.options);
      });
    }

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

export function clearModelCache() {
  Object.keys(modelCache).forEach(key => {
    delete modelCache[key];
  });
  log('تمامی مدل‌ها از cache پاک شدند', 'warn');
}

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