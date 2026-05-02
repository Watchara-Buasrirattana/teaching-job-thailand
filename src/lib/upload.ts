const UPLOAD_API_URL = process.env.UPLOAD_API_URL!;
const UPLOAD_API_SECRET = process.env.UPLOAD_API_SECRET!;

// อัปโหลดไฟล์ไป Z.com
export async function uploadFile(
    file: File,
    fieldName: string,
    folder: 'news' | 'teachers' | 'applicants'
): Promise<string> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${UPLOAD_API_URL}?folder=${folder}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${UPLOAD_API_SECRET}` },
        body: formData
    });

    const result = await response.json();
    if (!result.success) throw new Error('Upload failed: ' + result.message);
    return result.urls[fieldName];
}

// ลบไฟล์จาก Z.com
export async function deleteFile(fileUrl: string): Promise<void> {
    const deleteApiUrl = process.env.UPLOAD_API_URL!.replace('upload.php', 'delete.php');
    
    await fetch(deleteApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${UPLOAD_API_SECRET}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: fileUrl })
    });
}