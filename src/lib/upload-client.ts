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
    formData.append('expiry', String(expiry));
    formData.append('signature', signature);

    const uploadUrl = `${process.env.NEXT_PUBLIC_UPLOAD_API_URL}?folder=${folder}`;

    const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Upload HTTP error: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    if (!result.success) {
        throw new Error(`Upload failed: ${result.message ?? 'Unknown error'}`);
    }

    const url = result.urls?.[fieldName];
    if (!url) {
        throw new Error(`Upload succeeded but URL for "${fieldName}" is missing in response`);
    }

    return url;
}

export async function uploadGalleryFilesDirect(
    files: File[],
    folder: 'news' | 'teachers' | 'applicants'
): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        if (file.size === 0) continue;
        const url = await uploadFileDirect(file, 'image', folder);
        urls.push(url);
    }
    return urls;
}