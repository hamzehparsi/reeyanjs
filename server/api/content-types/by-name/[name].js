// server/api/content-types/by-name/[name].js
import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const { name } = event.context.params;

  const contentType = await ContentType.findOne({ collectionName: name });

  if (!contentType) {
    throw createError({ statusCode: 404, message: "Content type not found" });
  }
  return contentType;
});
