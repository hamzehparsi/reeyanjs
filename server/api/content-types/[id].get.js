import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  try {
    const contentType = await ContentType.findById(id).lean();

    if (!contentType) {
      throw createError({ statusCode: 404, message: "محتوا پیدا نشد" });
    }

    return {
      message: "اطلاعات نوع محتوا",
      contentType,
    };
  } catch (err) {
    console.error("❌ خطا در دریافت content-type:", err.message);
    throw createError({
      statusCode: 500,
      message: "خطا در دریافت نوع محتوا",
    });
  }
});
