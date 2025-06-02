import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // مثلاً: admin, editor
    permissions: [{ type: String }], // مثلاً: ['create:article', 'read:users']
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
