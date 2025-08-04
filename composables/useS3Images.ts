import { getS3Images, type S3Object } from '~/lib/utils/s3';

export function useS3Images() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const images = ref<S3Object[]>([]);

  /**
   * Fetch images from S3 bucket
   * @param bucketUrl - The S3 bucket URL with query parameters
   * @param prefix - Optional prefix to filter objects (e.g., 'upload/')
   */
  async function fetchImages(bucketUrl: string, prefix?: string) {
    try {
      loading.value = true;
      error.value = null;

      const url = prefix ? `${bucketUrl}?prefix=${prefix}` : bucketUrl;
      const fetchedImages = await getS3Images(url);
      images.value = fetchedImages;
    } catch (err) {
      console.error('Error fetching S3 images:', err);
      error.value = 'Failed to load images from S3 bucket';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get image URL for display
   * @param image - S3 object
   * @returns Full URL to the image
   */
  function getImageUrl(image: S3Object): string {
    // Extract bucket URL from the listing URL
    const baseUrl = image.key.startsWith('http')
      ? image.key
      : `https://ignite-market-images.s3.amazonaws.com/${image.key}`;
    return baseUrl;
  }

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted size string
   */
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file name from S3 key
   * @param key - S3 object key
   * @returns File name
   */
  function getFileName(key: string): string {
    return key.split('/').pop() || key;
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    images: readonly(images),
    fetchImages,
    getImageUrl,
    formatFileSize,
    getFileName,
  };
}
