import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs';
import Media from '../../models/Media';

export default defineEventHandler(async (event) => {
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(event.req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(createError({ statusCode: 500, statusMessage: 'Failed to upload media.' }));
      }

      const file = files.file ? files.file[0] : null;
      if (!file) {
        return reject(createError({ statusCode: 400, statusMessage: 'No file uploaded.' }));
      }

      try {
        // Move the file from temp location to the designated upload directory
        // Formidable already moves the file, so we just need to get the correct path
        const filename = path.basename(file.filepath);
        const url = `/uploads/${filename}`;
        const altText = Array.isArray(fields.altText) ? fields.altText[0] : fields.altText || '';

        const media = new Media({
          filename: file.originalFilename,
          url: url,
          mimeType: file.mimetype,
          size: file.size,
          altText: altText,
        });

        await media.save();

        resolve({ success: true, media });
      } catch (dbError) {
        console.error('Error saving media to database:', dbError);
        // If there's a DB error, try to clean up the uploaded file
        fs.unlink(file.filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
        });
        return reject(createError({ statusCode: 500, statusMessage: 'Failed to save media information.' }));
      }
    });
  });
}); 