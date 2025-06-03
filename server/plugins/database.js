import mongoose from "mongoose";
export default defineNitroPlugin((plugin) => {
  mongoose.connect(useRuntimeConfig().MONGO_URI);
});
