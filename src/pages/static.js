/**
 * Static assets handler
 * Redirects /images/* requests to Supabase Storage public URLs
 */

export async function handleStaticAssets(request, env, defaultContentType) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Redirect to Supabase Storage public URL
  const objectKey = path.replace('/images/', '');

  // Construct Supabase Storage URL - requires SUPABASE_URL environment variable
  const supabaseUrl = env?.SUPABASE_URL || process.env.SUPABASE_URL
  if (!supabaseUrl) {
    return new Response('Supabase URL not configured', { status: 500 })
  }
  const supabaseStorageUrl = `${supabaseUrl}/storage/v1/object/public/image/${objectKey}`;

  console.log(`[Static Assets] Redirecting to Supabase Storage: ${objectKey}`);

  // Fetch from Supabase Storage and proxy the response
  try {
    const response = await fetch(supabaseStorageUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response('Image not found', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
      throw new Error(`Supabase Storage error: ${response.status}`);
    }

    // Copy response with caching
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('[Static Assets] Error:', error);
    return new Response(`Error loading image: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
