import ContentType from "~/server/models/ContentType";

export default defineEventHandler(async (event) => {
  const contentTypes = await ContentType.find();
  return {
    message: "لیست انوع محتوا ها",
    contentTypes: contentTypes,
  };
});
