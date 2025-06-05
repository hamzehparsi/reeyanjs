import mongoose from "mongoose";
import ContentType from "~/server/models/ContentType";

const modelCache = {};

export async function getModelByName(name) {
  if (modelCache[name]) {
    return modelCache[name];
  }

  const contentType = await ContentType.findOne({ name });

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

  const Model = mongoose.models[name] || mongoose.model(name, schema);
  modelCache[name] = Model;

  return Model;
}
