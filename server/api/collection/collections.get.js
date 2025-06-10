import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const result = [];

  for (const col of collections) {
    const count = await mongoose.connection.db.collection(col.name).countDocuments();
    result.push({ name: col.name, count });
  }

  return result;
});