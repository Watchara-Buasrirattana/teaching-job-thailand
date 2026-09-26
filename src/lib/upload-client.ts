// lib/upload-client.ts (client-side, ไม่มี process.env secret)
export async function getUploadToken(folder: 'news' | 'teachers' | 'applicants') {
    const res = await fetch('/api/admin/upload-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
    });
    if (!res.ok) throw new Error('Failed to get upload token');
    return res.json() as Promise<{ folder: string; expiry: number; signature: string }>;
}

export async function uploadFileDirect(
    file: File,
    fieldName: string,
    folder: 'news' | 'teachers' | 'applicants'
): Promise<string> {
    const { expiry, signature } = await getUploadToken(folder);

    const formData = new FormData();
    formData.append(fieldName, file);
    formData.append('folder', folder);
    formData.append('expiry', String(expiry));
    formData.append('signature', signature);

    const res = await fetch(process.env.NEXT_PUBLIC_UPLOAD_API_URL!, {
        method: 'POST',
        body: formData, // ไม่ต้องใส่ Authorization Bearer ถาวรแล้ว
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message ?? 'Upload failed');
    return result.urls[fieldName];
}