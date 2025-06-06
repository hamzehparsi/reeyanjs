// server/models/ContentType.js
import mongoose from "mongoose";
const FieldSchema = new mongoose.Schema({
  name: String, // مثلاً: title
  label: String, // مثلاً: عنوان
  type: {
    type: String,
    enum: [
      "shortText",
      "longText",
      "media",
      "tags",
      "boolean",
      "number",
      "date",
      "select",
      "multiSelect",
    ],
    default: "shortText",
  },
  options: [String], // فقط برای select و multiSelect
});

const ContentTypeSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    collectionName: String, // articles (جدید!)

    fields: [FieldSchema], // فیلدهای مدل اینجا ذخیره می‌شن
  },
  { timestamps: true }
);

export default mongoose.models.ContentType ||
  mongoose.model("ContentType", ContentTypeSchema);
