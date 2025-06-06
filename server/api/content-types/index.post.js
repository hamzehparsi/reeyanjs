import ContentType from "~/server/models/ContentType";
import pluralize from "pluralize";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, displayName } = body;
  console.log(body);
  
  if (!name || !displayName) {
    throw createError({
      statusCode: 400,
      message: "نام یا عنوان نمایش داده نشده",
    });
  }

  const existing = await ContentType.findOne({ name });
  if (existing) {
    throw createError({
      statusCode: 409,
      message: "مدل با این نام قبلاً ثبت شده",
    });
  }

  const newContentType = await ContentType.create({
    name,
    displayName,
    collectionName: pluralize(name), // ← اضافه شده
    fields: [],
  });

  return { message: "مدل ایجاد شد", contentType: newContentType };
});
