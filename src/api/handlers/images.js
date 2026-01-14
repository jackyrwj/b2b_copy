/**
 * Image serving handler for R2 storage
 * Serves images from R2 bucket with proper caching headers
 */

import { getImage } from '../../utils/r2.js';

/**
 * Handle image requests
 * GET /api/images/:filename
 */
export async function handleImages(request, env, corsHeaders) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Extract filename from path: /api/images/filename.jpg
  const filename = pathParts[2];

  if (!filename) {
    return new Response(JSON.stringify({
      error: 'Filename is required'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Get image from R2
  const image = await getImage(env, filename);

  if (!image) {
    return new Response(JSON.stringify({
      error: 'Image not found',
      filename: filename
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Return image with caching headers
  return image;
}
