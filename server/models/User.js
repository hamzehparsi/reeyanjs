import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true })

// فقط در محیط سرور این خط اجرا بشه:
export default mongoose.models?.User || mongoose.model('User', UserSchema)
