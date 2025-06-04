// server/api/content-types/[id]/fields.post.js
import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);

  const contentType = await ContentType.findById(id);
  if (!contentType) {
    throw createError({
      statusCode: 404,
      statusMessage: "Content Type Not Found",
    });
  }

  contentType.fields.push({
    name: body.name,
    label: body.label,
    type: body.type,
    options: Array.isArray(body.options)
      ? body.options[0].split("،").map((o) => o.trim())
      : typeof body.options === "string"
      ? body.options.split("،").map((o) => o.trim())
      : [],
  });

  await contentType.save();

  return {
    message: "فیلد با موفقیت اضافه شد",
    contentType,
  };
});
