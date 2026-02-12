import Endpoints from '~/lib/values/endpoints';

const IMAGE_CDN_BASE = 'https://images.ignitemarket.xyz/upload';

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [meta, content] = dataUrl.split(',');
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] || 'image/png';
  const binary = atob(content);
  const len = binary.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mime });
}

export async function uploadFileToS3(file: File, folder: string, fileName?: string): Promise<string> {
  const name = fileName || file.name;
  const key = `${folder}/${name}`;
  const res = await $api.post<any>(Endpoints.imageUpload, { fileName: key });
  const uploadUrl = res?.data?.uploadUrl;
  if (!uploadUrl) {
    throw new Error('Upload URL missing from response');
  }

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  if (!putRes.ok) {
    const body = await putRes.text().catch(() => '');
    throw new Error(`Upload failed (${putRes.status}): ${body}`);
  }
  return `${IMAGE_CDN_BASE}/${folder}/${name}`;
}

export async function uploadDataUrlToS3(dataUrl: string, folder: string, fileName: string): Promise<string> {
  const file = dataUrlToFile(dataUrl, fileName);
  return uploadFileToS3(file, folder, fileName);
}
