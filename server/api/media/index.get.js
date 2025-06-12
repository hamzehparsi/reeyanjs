import Media from '../../../server/models/Media';

export default defineEventHandler(async (event) => {
  try {
    const mediaItems = await Media.find();
    return { success: true, mediaItems };
  } catch (error) {
    console.error('Error fetching media items:', error);
    return createError({ statusCode: 500, statusMessage: 'Failed to fetch media items.' });
  }
}); 