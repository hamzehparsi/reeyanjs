import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const { id, fieldId } = event.context.params;
  const body = await readBody(event);

  // اعتبارسنجی ساده
  if (!body.name || !body.label || !body.type) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: "نام، برچسب و نوع فیلد الزامی است",
      })
    );
  }

  try {
    const contentType = await ContentType.findById(id);
    if (!contentType) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "Content Type یافت نشد" })
      );
    }

    // پیدا کردن فیلد مورد نظر
    const field = contentType.fields.id(fieldId);
    if (!field) {
      return sendError(
        event,
        createError({ statusCode: 404, message: "فیلد یافت نشد" })
      );
    }

    // به‌روزرسانی مقادیر
    field.name = body.name;
    field.label = body.label;
    field.type = body.type;
    field.options = ["select", "multiSelect", "media"].includes(body.type)
      ? body.options || []
      : undefined;
    field.allowMultiple = body.allowMultiple || false; // اضافه کردن allowMultiple

    await contentType.save();

    return { message: "فیلد با موفقیت به‌روزرسانی شد", field };
  } catch (error) {
    console.error("Error updating field:", error);
    return sendError(
      event,
      createError({ statusCode: 500, message: "خطا در به‌روزرسانی فیلد" })
    );
  }
});