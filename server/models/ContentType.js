import mongoose from "mongoose";

const ContentTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // slug
    displayName: { type: String, required: true }, // عنوان قابل نمایش
    fields: [
      {
        name: String,
        type: String, // short-text, long-text, media, tag, etc.
        required: Boolean,
        options: mongoose.Schema.Types.Mixed, // برای dropdown یا enum
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ContentType ||
  mongoose.model("ContentType", ContentTypeSchema);
