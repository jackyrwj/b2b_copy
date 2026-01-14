/**
 * Upload API Handler
 * Handles file uploads to Cloudflare R2 Storage
 */

import { uploadImage as uploadToR2 } from '../../utils/r2.js';
import { requireSuperAdmin } from './admin';

export async function handleUpload(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // POST /api/upload/image - Upload image
  if (method === 'POST' && pathParts[2] === 'image') {
    return uploadImageHandler(request, env, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Upload image to R2 Storage
async function uploadImageHandler(request, env, corsHeaders) {
  try {
    // Check if user is super admin
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'products';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        error: 'File too large. Maximum size is 5MB.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${random}.${extension}`;

    // Upload to R2 Storage
    const imageUrl = await uploadToR2(env, file, filename, folder);

    return new Response(JSON.stringify({
      success: true,
      url: imageUrl,
      filename: filename,
      path: `${folder}/${filename}`,
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
