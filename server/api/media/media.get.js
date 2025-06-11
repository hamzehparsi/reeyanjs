import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // اگر پوشه uploads وجود نداشت، آن را ایجاد کن
    await fs.mkdir(uploadDir, { recursive: true });

    const files = await fs.readdir(uploadDir);

    const mediaItems = await Promise.all(files.map(async (fileName) => {
      const filePath = path.join(uploadDir, fileName);
      const stats = await fs.stat(filePath);
      const url = `/uploads/${fileName}`; // URL قابل دسترس از فرانت‌اند

      // تلاش برای حدس زدن mimeType ساده بر اساس پسوند
      let mimeType = 'application/octet-stream';
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (fileName.endsWith('.png')) mimeType = 'image/png';
      else if (fileName.endsWith('.gif')) mimeType = 'image/gif';
      else if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (fileName.endsWith('.mp4')) mimeType = 'video/mp4';
      // ... می‌توانید انواع دیگر فایل را اضافه کنید

      return {
        _id: fileName, // یا یک ID منحصر به فرد از دیتابیس اگر از آن استفاده می‌کنید
        name: fileName,
        url: url,
        mimeType: mimeType,
        size: stats.size,
        uploadedAt: stats.birthtime,
      };
    }));

    return { data: mediaItems };
  } catch (error) {
    console.error('Error fetching media items:', error);
    return createError({
      statusCode: 500,
      message: 'خطا در دریافت فایل‌ها: ' + error.message,
    });
  }
});
