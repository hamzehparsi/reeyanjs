import Media from '../../../server/models/Media';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createError({ statusCode: 400, statusMessage: 'Invalid Media ID.' });
  }

  try {
    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return createError({ statusCode: 404, statusMessage: 'Media item not found.' });
    }
    return { success: true, mediaItem };
  } catch (error) {
    console.error('Error fetching media item:', error);
    return createError({ statusCode: 500, statusMessage: 'Failed to fetch media item.' });
  }
}); 