import ContentType from "~/server/models/ContentType";
import mongoose from "mongoose";
import { modelCache } from '~/server/utils/model-factory';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  console.log('Request body:', body); // دیباگ درخواست ورودی
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
    allowMultiple: body.allowMultiple || false, // اضافه کردن allowMultiple
  });

  await contentType.save();

  const collectionName = contentType.collectionName;
  delete mongoose.models[collectionName];
  delete modelCache[collectionName];

  return {
    message: "فیلد با موفقیت اضافه شد",
    contentType,
  };
});