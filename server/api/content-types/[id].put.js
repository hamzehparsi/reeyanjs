import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);

  try {
    const contentType = await ContentType.findById(id);

    if (!contentType) {
      throw createError({ statusCode: 404, message: "نوع محتوا پیدا نشد" });
    }

    // فقط فیلدهای قابل ویرایش
    // if (body.name) contentType.name = body.name;
    if (body.displayName) contentType.displayName = body.displayName;

    await contentType.save();

    return {
      message: "نوع محتوا با موفقیت به‌روزرسانی شد",
      contentType,
    };
  } catch (err) {
    console.error("❌ خطا در به‌روزرسانی content-type:", err.message);
    throw createError({
      statusCode: 500,
      message: "خطا در به‌روزرسانی نوع محتوا",
    });
  }
});
