import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ اتصال موفق به MongoDB");
  } catch (err) {
    console.error("❌ خطا در اتصال به MongoDB:", err.message);
  }
});
