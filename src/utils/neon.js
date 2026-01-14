/**
 * Neon (PostgreSQL) Client for Cloudflare Workers
 * Replaces Supabase with Neon database while keeping Supabase Storage for images
 */

import { neon } from '@neondatabase/serverless'

const STORAGE_BUCKET = 'image'

// Create Neon SQL client
function createNeonClient(env) {
  // 敏感信息必须通过环境变量传入，不再硬编码
  const neonUrl = env?.NEON_DATABASE_URL
  if (!neonUrl) {
    throw new Error('NEON_DATABASE_URL environment variable is required. Set it with: wrangler secret put NEON_DATABASE_URL')
  }
  return neon(neonUrl)
}

// Helper to get Supabase URL from env
function getSupabaseConfig(env) {
  // 敏感信息必须通过环境变量传入
  const url = env?.SUPABASE_URL
  const anonKey = env?.SUPABASE_ANON_KEY
  const serviceKey = env?.SUPABASE_SERVICE_KEY

  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required')
  }

  return { url, anonKey, serviceKey }
}

// Helper to execute SQL queries
async function executeQuery(env, query, params = []) {
  const sql = createNeonClient(env)

  try {
    const result = await sql.query(query, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Products
async function getProducts(env, options = {}) {
  const { featured = false, active = true, limit = 100 } = options

  let query = 'SELECT * FROM products'
  const conditions = []
  const params = []
  let paramIndex = 1

  if (active) {
    conditions.push(`is_active = $${paramIndex}`)
    params.push(true)
    paramIndex++
  }
  if (featured) {
    conditions.push(`is_featured = $${paramIndex}`)
    params.push(true)
    paramIndex++
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`
  params.push(limit)

  return executeQuery(env, query, params)
}

async function getProduct(env, id) {
  const query = 'SELECT * FROM products WHERE id = $1'
  const result = await executeQuery(env, query, [id])
  return result[0] || null
}

async function createProduct(env, product) {
  const {
    name,
    description,
    detailed_description,
    specifications,
    image_url,
    gallery_images,
    category,
    is_featured,
    is_active
  } = product

  const query = `
    INSERT INTO products (
      name, description, detailed_description, specifications,
      image_url, gallery_images, category, is_featured, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `

  const params = [
    name,
    description || null,
    detailed_description || null,
    specifications || null,
    image_url || null,
    gallery_images ? JSON.stringify(gallery_images) : null,
    category || null,
    is_featured || false,
    is_active !== undefined ? is_active : true
  ]

  const result = await executeQuery(env, query, params)
  return result[0]
}

async function updateProduct(env, id, updates) {
  const fields = []
  const params = []
  let paramIndex = 1

  const allowedFields = [
    'name', 'description', 'detailed_description', 'specifications',
    'image_url', 'gallery_images', 'category', 'is_featured', 'is_active'
  ]

  for (const field of allowedFields) {
    if (field in updates) {
      fields.push(`${field} = $${paramIndex}`)
      if (field === 'gallery_images') {
        params.push(JSON.stringify(updates[field]))
      } else {
        params.push(updates[field])
      }
      paramIndex++
    }
  }

  if (fields.length === 0) {
    throw new Error('No fields to update')
  }

  const query = `
    UPDATE products
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `
  params.push(id)

  const result = await executeQuery(env, query, params)
  return result[0]
}

async function deleteProduct(env, id) {
  return updateProduct(env, id, { is_active: false })
}

// Get unique categories from products
async function getCategories(env) {
  const query = `
    SELECT DISTINCT category
    FROM products
    WHERE category IS NOT NULL AND category != ''
    AND is_active = true
    ORDER BY category ASC
  `
  return executeQuery(env, query)
}

// Inquiries
async function getInquiries(env, options = {}) {
  const { status, limit = 100 } = options

  let query = 'SELECT * FROM inquiries'
  const params = []
  let paramIndex = 1

  if (status) {
    query += ` WHERE status = $${paramIndex}`
    params.push(status)
    paramIndex++
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`
  params.push(limit)

  return executeQuery(env, query, params)
}

async function createInquiry(env, inquiry) {
  const {
    product_id,
    name,
    email,
    company,
    phone,
    country,
    message
  } = inquiry

  const query = `
    INSERT INTO inquiries (
      product_id, name, email, company, phone, country, message
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `

  const params = [
    product_id || null,
    name,
    email,
    company || null,
    phone || null,
    country || null,
    message
  ]

  const result = await executeQuery(env, query, params)
  return result[0]
}

async function updateInquiryStatus(env, id, status) {
  const query = `
    UPDATE inquiries
    SET status = $1
    WHERE id = $2
    RETURNING *
  `
  const result = await executeQuery(env, query, [status, id])
  return result[0]
}

// Auth - Simplified login (in production, use proper JWT)
async function loginAdmin(env, username, password) {
  // Hash password
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // Get admin from database
  const query = `
    SELECT id, username, role
    FROM admins
    WHERE username = $1 AND password_hash = $2
    LIMIT 1
  `
  const result = await executeQuery(env, query, [username, hashHex])

  if (result && result.length > 0) {
    const admin = result[0]

    // Update last login
    await executeQuery(env,
      'UPDATE admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    )

    return admin
  }
  return null
}

// Settings
async function getSettings(env, key) {
  const query = 'SELECT value FROM website_settings WHERE key = $1 LIMIT 1'
  const result = await executeQuery(env, query, [key])

  if (result && result.length > 0) {
    return result[0].value
  }
  return null
}

async function updateSettings(env, key, value) {
  // Use upsert via INSERT ... ON CONFLICT
  const query = `
    INSERT INTO website_settings (key, value)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE SET
      value = $2,
      updated_at = NOW()
    RETURNING *
  `

  const result = await executeQuery(env, query, [key, value])
  return result[0]
}

// Dashboard Stats
async function getDashboardStats(env) {
  const products = await executeQuery(env, 'SELECT COUNT(*) as count FROM products')
  const inquiries = await executeQuery(env, 'SELECT COUNT(*) as count FROM inquiries')
  const pending = await executeQuery(env,
    "SELECT COUNT(*) as count FROM inquiries WHERE status = 'pending'"
  )

  return {
    totalProducts: products[0].count || 0,
    totalInquiries: inquiries[0].count || 0,
    pendingInquiries: pending[0].count || 0
  }
}

// Image Upload to Supabase Storage (KEPT - no changes)
async function uploadImage(env, file, folder = 'products') {
  const config = getSupabaseConfig(env)
  const storageUrl = `${config.url}/storage/v1/object`

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const extension = file.name.split('.').pop();
  const filename = `${folder}/${timestamp}-${randomStr}.${extension}`;

  // Upload to Supabase Storage using Service Role key (bypasses RLS)
  const response = await fetch(`${storageUrl}/${STORAGE_BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': config.serviceKey,
      'Authorization': `Bearer ${config.serviceKey}`,
      'Content-Type': file.type,
      'Upsert': 'true',
    },
    body: file,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  // Generate public URL
  const imageUrl = `${config.url}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;

  return {
    url: imageUrl,
    filename: filename,
    size: file.size,
    type: file.type,
  };
}

// Get signed URL for private storage
async function getSignedUrl(env, filename, expiresIn = 3600) {
  const config = getSupabaseConfig(env)
  const storageUrl = `${config.url}/storage/v1/object`

  const response = await fetch(`${storageUrl}/sign/${STORAGE_BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': config.serviceKey,
      'Authorization': `Bearer ${config.serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate signed URL');
  }

  const data = await response.json();
  return data.signedUrl;
}

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  loginAdmin,
  getSettings,
  updateSettings,
  getDashboardStats,
  uploadImage,
  getSignedUrl
}
