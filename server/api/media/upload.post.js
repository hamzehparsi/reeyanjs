import formidable from 'formidable'; // برای پردازش فرم‌دیتای فایل
import fs from 'fs/promises'; // برای ذخیره فایل
import path from 'path'; // برای مدیریت مسیرها

// مدل Mongoose برای ذخیره اطلاعات فایل در دیتابیس
// مثلاً:
// import Media from '~/server/models/Media';

export default defineEventHandler(async (event) => {
    const form = formidable({});
    const [fields, files] = await form.parse(event.req);

    const file = files.file[0]; // اگر فقط یک فایل آپلود می‌شود

    if (!file) {
        return createError({ statusCode: 400, message: 'فایلی برای آپلود انتخاب نشده است.' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads'); // مسیری برای ذخیره فایل‌ها
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.copyFile(file.filepath, filePath);

    // ذخیره اطلاعات فایل در دیتابیس (مثلاً MongoDB)
    // const newMedia = await Media.create({
    //     name: file.originalFilename,
    //     url: `/uploads/${fileName}`, // URL قابل دسترس از فرانت‌اند
    //     mimeType: file.mimetype,
    //     size: file.size,
    //     // ... سایر اطلاعات
    // });

    return {
        message: 'فایل با موفقیت آپلود شد',
        // media: newMedia // برگرداندن اطلاعات فایل ذخیره شده
        media: {
            _id: 'temp_id_' + Date.now(), // یک آی‌دی موقت برای تست
            name: file.originalFilename,
            url: `/uploads/${fileName}`,
            mimeType: file.mimetype,
            size: file.size,
        }
    };
});
