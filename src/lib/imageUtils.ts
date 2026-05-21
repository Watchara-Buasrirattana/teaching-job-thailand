/**
 * แปลงไฟล์รูปภาพเป็น WebP ก่อน upload
 * ลดขนาดได้ 25-35% เมื่อเทียบกับ PNG/JPG
 */
export async function convertToWebP(
    file: File,
    quality: number = 0.85
): Promise<File> {
    // ถ้าเป็น WebP อยู่แล้ว ไม่ต้องแปลง
    if (file.type === 'image/webp') return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(url);
                resolve(file); // fallback — ส่ง file เดิม
                return;
            }

            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file); // fallback
                        return;
                    }
                    // เปลี่ยน extension เป็น .webp
                    const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
                    resolve(new File([blob], newName, { type: 'image/webp' }));
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // fallback — ส่ง file เดิมถ้าแปลงไม่ได้
        };

        img.src = url;
    });
}

/**
 * แปลงหลายไฟล์พร้อมกัน
 */
export async function convertAllToWebP(
    files: File[],
    quality: number = 0.85
): Promise<File[]> {
    return Promise.all(files.map(f => convertToWebP(f, quality)));
}