import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const fieldId = event.context.params.fieldId;
  if (!id || !fieldId) {
    return createError({
      statusCode: 400,
      message: "شناسه و نام فیلد لازم است",
    });
  }

  const contentType = await ContentType.findById(id);
  if (!contentType) {
    return createError({
      statusCode: 404,
      message: "نوع محتوا پیدا نشد",
    });
  }

  contentType.fields = contentType.fields.filter(
    (field) => String(field._id) !== fieldId
  );
  await contentType.save();

  return { message: "فیلد با موفقیت حذف شد" };
});
