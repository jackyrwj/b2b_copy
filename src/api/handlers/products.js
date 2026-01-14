/**
 * Products API Handler
 * Handles all product-related API requests
 */

import { requireSuperAdmin } from './admin';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } from '../../utils/neon';

export async function handleProducts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // GET /api/products - Get all products
  if (method === 'GET' && pathParts.length === 2) {
    return getAllProducts(env, corsHeaders, request);
  }

  // GET /api/products/categories - Get unique categories
  if (method === 'GET' && pathParts[2] === 'categories') {
    return getCategoriesHandler(env, corsHeaders);
  }

  // GET /api/products/featured - Get featured products
  if (method === 'GET' && pathParts[2] === 'featured') {
    return getFeaturedProducts(env, corsHeaders);
  }

  // GET /api/products/:id - Get single product
  if (method === 'GET' && pathParts.length === 3) {
    const productId = pathParts[2];
    return getProductHandler(env, productId, corsHeaders, request);
  }

  // POST /api/products - Create new product (Admin only)
  if (method === 'POST' && pathParts.length === 2) {
    return createProductHandler(request, env, corsHeaders);
  }

  // PUT /api/products/:id - Update product (Admin only)
  if (method === 'PUT' && pathParts.length === 3) {
    const productId = pathParts[2];
    return updateProductHandler(request, env, productId, corsHeaders);
  }

  // DELETE /api/products/:id - Delete product (Admin only)
  if (method === 'DELETE' && pathParts.length === 3) {
    const productId = pathParts[2];
    return deleteProductHandler(request, env, productId, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get all products
async function getAllProducts(env, corsHeaders, request) {
  try {
    // Check if this is an authenticated admin request
    const authHeader = request?.headers?.get('Authorization');
    const isAdmin = authHeader && authHeader.startsWith('Bearer ');

    const products = await getProducts(env, { active: !isAdmin });

    return new Response(JSON.stringify({ success: true, data: products }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get featured products
async function getFeaturedProducts(env, corsHeaders) {
  try {
    const products = await getProducts(env, { featured: true, active: true });

    return new Response(JSON.stringify({ success: true, data: products }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get unique categories
async function getCategoriesHandler(env, corsHeaders) {
  try {
    const categories = await getCategories(env);

    // Extract category names from result
    const categoryNames = categories.map(c => c.category);

    return new Response(JSON.stringify({ success: true, data: categoryNames }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get single product
async function getProductHandler(env, productId, corsHeaders, request) {
  try {
    const product = await getProduct(env, parseInt(productId));

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if active for non-admin users
    const authHeader = request?.headers?.get('Authorization');
    const isAdmin = authHeader && authHeader.startsWith('Bearer ');
    if (!isAdmin && !product.is_active) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: product }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Create new product (Super Admin only)
async function createProductHandler(request, env, corsHeaders) {
  try {
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    const product = await createProduct(env, {
      name: data.name,
      description: data.description || null,
      detailed_description: data.detailed_description || null,
      specifications: data.specifications || null,
      image_url: data.image_url || null,
      gallery_images: data.gallery_images || null,
      category: data.category || null,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    // Supabase returns null on insert with return=minimal
    // Return a success message without ID, or let client handle it
    return new Response(JSON.stringify({
      success: true,
      message: 'Product created successfully'
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update product (Super Admin only)
async function updateProductHandler(request, env, productId, corsHeaders) {
  try {
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    await updateProduct(env, parseInt(productId), {
      name: data.name,
      description: data.description || null,
      detailed_description: data.detailed_description || null,
      specifications: data.specifications || null,
      image_url: data.image_url || null,
      gallery_images: data.gallery_images || null,
      category: data.category || null,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Delete product (Super Admin only - soft delete)
async function deleteProductHandler(request, env, productId, corsHeaders) {
  try {
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await deleteProduct(env, parseInt(productId));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
