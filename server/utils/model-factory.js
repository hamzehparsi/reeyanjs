// server/utils/model-factory.js
import mongoose from "mongoose";
import ContentType from "~/server/models/ContentType";

const modelCache = {};
export async function getModelByName(collectionName) {
  if (modelCache[collectionName]) {
    return modelCache[collectionName];
  }

  // ← تغییر اصلی این خطه
  const contentType = await ContentType.findOne({ collectionName });

  if (!contentType) {
    return null;
  }

  const fields = contentType.fields || [];

  const schemaDefinition = {};

  for (const field of fields) {
    switch (field.type) {
      case 'text':
      case 'textarea':
        schemaDefinition[field.name] = { type: String };
        break;
      case 'number':
        schemaDefinition[field.name] = { type: Number };
        break;
      case 'date':
        schemaDefinition[field.name] = { type: Date };
        break;
      case 'select':
        schemaDefinition[field.name] = { type: String };
        break;
      case 'multi-select':
        schemaDefinition[field.name] = [{ type: String }];
        break;
      default:
        schemaDefinition[field.name] = { type: String };
    }
  }

  const schema = new mongoose.Schema(schemaDefinition, {
    timestamps: true,
  });

  const Model = mongoose.models[collectionName] || mongoose.model(collectionName, schema);
  modelCache[collectionName] = Model;

  return Model;
}
