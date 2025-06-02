import mongoose from 'mongoose'

const ContentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // مثلاً: article, product
  fields: [{
    name: { type: String, required: true },     // مثلاً: title, price
    type: { type: String, required: true },     // مثلاً: string, number, boolean
    required: { type: Boolean, default: false }
  }]
}, { timestamps: true })

export default mongoose.models.ContentType || mongoose.model('ContentType', ContentTypeSchema)
