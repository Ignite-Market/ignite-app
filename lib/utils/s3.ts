export interface S3Object {
  key: string;
  lastModified: string;
  etag: string;
  size: number;
  storageClass: string;
}

export interface S3ListResponse {
  objects: S3Object[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

/**
 * Parse S3 XML response to extract object information
 * @param xmlString - The XML response from S3 bucket listing
 * @returns Parsed S3 objects with metadata
 */
export function parseS3XmlResponse(xmlString: string): S3ListResponse {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const objects: S3Object[] = [];

  // Parse Contents elements (S3 objects)
  const contents = xmlDoc.getElementsByTagName('Contents');
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    const key = content.getElementsByTagName('Key')[0]?.textContent || '';
    const lastModified = content.getElementsByTagName('LastModified')[0]?.textContent || '';
    const etag = content.getElementsByTagName('ETag')[0]?.textContent || '';
    const size = parseInt(content.getElementsByTagName('Size')[0]?.textContent || '0', 10);
    const storageClass = content.getElementsByTagName('StorageClass')[0]?.textContent || '';

    objects.push({
      key,
      lastModified,
      etag: etag.replace(/"/g, ''), // Remove quotes from ETag
      size,
      storageClass,
    });
  }

  // Parse IsTruncated
  const isTruncated = xmlDoc.getElementsByTagName('IsTruncated')[0]?.textContent === 'true';

  // Parse NextContinuationToken if present
  const nextContinuationTokenElement = xmlDoc.getElementsByTagName('NextContinuationToken')[0];
  const nextContinuationToken = nextContinuationTokenElement?.textContent || undefined;

  return {
    objects,
    isTruncated,
    nextContinuationToken,
  };
}

/**
 * Fetch and parse S3 bucket listing
 * @param bucketUrl - The S3 bucket URL with query parameters
 * @returns Promise with parsed S3 objects
 */
export async function fetchS3Objects(bucketUrl: string): Promise<S3ListResponse> {
  try {
    const response = await fetch(bucketUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch S3 objects: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    return parseS3XmlResponse(xmlText);
  } catch (error) {
    console.error('Error fetching S3 objects:', error);
    throw error;
  }
}

/**
 * Filter S3 objects by file extension
 * @param objects - Array of S3 objects
 * @param extensions - Array of file extensions to include (e.g., ['jpg', 'png', 'gif'])
 * @returns Filtered array of S3 objects
 */
export function filterS3ObjectsByExtension(objects: S3Object[], extensions: string[]): S3Object[] {
  return objects.filter(obj => {
    const fileExtension = obj.key.split('.').pop()?.toLowerCase();
    return fileExtension && extensions.includes(fileExtension);
  });
}

/**
 * Get image objects from S3 bucket
 * @param bucketUrl - The S3 bucket URL
 * @returns Promise with image objects
 */
export async function getS3Images(bucketUrl: string): Promise<S3Object[]> {
  const response = await fetchS3Objects(bucketUrl);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return filterS3ObjectsByExtension(response.objects, imageExtensions);
}
