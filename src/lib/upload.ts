const UPLOAD_API_URL = process.env.UPLOAD_API_URL!;
const UPLOAD_API_SECRET = process.env.UPLOAD_API_SECRET!;

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
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Upload HTTP error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(`Upload failed: ${result.message ?? 'Unknown error'}`);
    }

    const url = result.urls?.[fieldName];
    if (!url) {
        throw new Error(`Upload succeeded but URL for "${fieldName}" is missing in response`);
    }

    return url;
}

export async function uploadGalleryFiles(
    files: File[],
    folder: 'news' | 'teachers' | 'applicants'
): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        if (file.size === 0) continue;
        const url = await uploadFile(file, 'image', folder);
        urls.push(url);
    }
    return urls;
}

export async function deleteFile(fileUrl: string): Promise<void> {
    const deleteApiUrl = UPLOAD_API_URL.replace('upload.php', 'delete.php');

    let response: Response;
    try {
        response = await fetch(deleteApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${UPLOAD_API_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: fileUrl }),
        });
    } catch (networkError) {
        console.error(`[deleteFile] Network error while deleting "${fileUrl}":`, networkError);
        return;
    }

    if (!response.ok) {
        console.error(`[deleteFile] HTTP ${response.status} while deleting "${fileUrl}"`);
        return;
    }

    const result = await response.json().catch(() => null);
    if (result && !result.success) {
        console.error(`[deleteFile] API reported failure for "${fileUrl}":`, result.message);
    }
}