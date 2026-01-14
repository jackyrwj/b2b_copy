/**
 * R2 Storage Utility Functions
 * Handles image upload, delete, and listing operations for Cloudflare R2
 */

/**
 * Upload an image to R2 storage
 * @param {Object} env - Cloudflare Workers environment
 * @param {File|Buffer} file - File or buffer to upload
 * @param {string} filename - Target filename in R2
 * @param {string} folder - Folder path (e.g., 'products', 'gallery')
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export async function uploadImage(env, file, filename, folder = 'products') {
  const key = `${folder}/${filename}`;

  // Handle File object or Buffer
  let data;
  let contentType;

  if (file instanceof File) {
    data = await file.arrayBuffer();
    contentType = file.type || 'image/jpeg';
  } else if (file.buffer) {
    // Buffer from formidable/multipart parser
    data = file.buffer;
    contentType = file.headers?.['content-type'] || 'image/jpeg';
  } else {
    throw new Error('Invalid file format. Expected File object or buffer.');
  }

  // Upload to R2
  await env.IMAGES.put(key, data, {
    httpMetadata: {
      contentType: contentType
    },
    customMetadata: {
      uploadedAt: new Date().toISOString()
    }
  });

  return getImageUrl(key);
}

/**
 * Delete an image from R2 storage
 * @param {Object} env - Cloudflare Workers environment
 * @param {string} filename - Filename to delete (can include folder path)
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export async function deleteImage(env, filename) {
  // Remove any URL prefix if present
  const key = filename.replace(/^\/api\/images\//, '').replace(/^https?:\/\/[^/]+\/api\/images\//, '');

  await env.IMAGES.delete(key);
  return true;
}

/**
 * List images in R2 storage
 * @param {Object} env - Cloudflare Workers environment
 * @param {string} prefix - Folder path to filter (e.g., 'products', 'gallery')
 * @returns {Promise<Array>} - Array of image objects with key, size, uploaded
 */
export async function listImages(env, prefix = '') {
  const listed = await env.IMAGES.list({ prefix });

  return listed.objects.map(obj => ({
    key: obj.key,
    filename: obj.key.split('/').pop(),
    size: obj.size,
    uploaded: obj.uploaded,
    url: getImageUrl(obj.key)
  }));
}

/**
 * Generate public URL for R2 image
 * @param {string} key - R2 object key (can include folder path)
 * @returns {string} - Public URL via API proxy
 */
export function getImageUrl(key) {
  const filename = key.includes('/') ? key.split('/').pop() : key;
  return `/api/images/${filename}`;
}

/**
 * Get image from R2 storage
 * @param {Object} env - Cloudflare Workers environment
 * @param {string} filename - Filename to retrieve
 * @returns {Promise<Response>} - Response with image data or 404
 */
export async function getImage(env, filename) {
  // Try to find the image in any folder
  const folders = ['products', 'gallery', 'uploads', 'test'];
  let object;

  // First try direct filename match
  object = await env.IMAGES.get(filename);

  // If not found, try in common folders
  if (!object) {
    for (const folder of folders) {
      object = await env.IMAGES.get(`${folder}/${filename}`);
      if (object) break;
    }
  }

  if (!object) {
    return null;
  }

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Content-Length', object.size);

  return new Response(object.body, { headers });
}

/**
 * Check if image exists in R2
 * @param {Object} env - Cloudflare Workers environment
 * @param {string} filename - Filename to check
 * @returns {Promise<boolean>} - True if exists
 */
export async function imageExists(env, filename) {
  const image = await getImage(env, filename);
  return image !== null;
}
