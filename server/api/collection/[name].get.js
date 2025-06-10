import { getModelByName } from '~/server/utils/model-factory';

export default defineEventHandler(async (event) => {
  const collectionName = event.context.params.name;
  const Model = await getModelByName(collectionName);
  if (!Model) return [];
  return await Model.find().lean();
});
