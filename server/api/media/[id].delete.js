import Media from '../../../server/models/Media';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

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

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), 'public', mediaItem.url);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
        // Optionally, you might want to return an error here, or just log it
      }
    });

    // Delete the media item from the database
    await Media.findByIdAndDelete(id);

    return { success: true, message: 'Media item deleted successfully.' };
  } catch (error) {
    console.error('Error deleting media item:', error);
    return createError({ statusCode: 500, statusMessage: 'Failed to delete media item.' });
  }
}); 