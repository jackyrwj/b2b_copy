/**
 * Import Data to Neon Database
 */

const { neon } = require('@neondatabase/serverless')
const fs = require('fs').promises

// Set NEON_DATABASE_URL environment variable before running this script
// Example: NEON_DATABASE_URL="postgresql://..." node scripts/import-to-neon.js
const NEON_URL = process.env.NEON_DATABASE_URL
if (!NEON_URL) {
  console.error('Error: NEON_DATABASE_URL environment variable is required')
  process.exit(1)
}

const sql = neon(NEON_URL)

async function importProducts() {
  console.log('Importing products...')
  const products = JSON.parse(await fs.readFile('migrate-products.json', 'utf-8'))

  for (const product of products) {
    try {
      await sql.query(`
        INSERT INTO products (
          id, name, description, detailed_description, specifications,
          image_url, gallery_images, category, is_featured, is_active,
          created_at, updated_at, slug, subcategory, price, stock_quantity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          detailed_description = EXCLUDED.detailed_description,
          specifications = EXCLUDED.specifications,
          image_url = EXCLUDED.image_url,
          gallery_images = EXCLUDED.gallery_images,
          category = EXCLUDED.category,
          is_featured = EXCLUDED.is_featured,
          is_active = EXCLUDED.is_active,
          slug = EXCLUDED.slug,
          subcategory = EXCLUDED.subcategory,
          price = EXCLUDED.price,
          stock_quantity = EXCLUDED.stock_quantity
      `, [
        product.id,
        product.name,
        product.description,
        product.detailed_description,
        product.specifications,
        product.image_url,
        product.gallery_images ? JSON.stringify(product.gallery_images) : null,
        product.category,
        product.is_featured,
        product.is_active,
        product.created_at,
        product.updated_at,
        product.slug,
        product.subcategory,
        product.price,
        product.stock_quantity
      ])
      console.log(`  ✓ Imported product: ${product.name}`)
    } catch (error) {
      console.error(`  ✗ Failed to import product ${product.id}:`, error.message)
    }
  }

  console.log(`✅ Imported ${products.length} products\n`)
}

async function importInquiries() {
  console.log('Importing inquiries...')
  const inquiries = JSON.parse(await fs.readFile('migrate-inquiries.json', 'utf-8'))

  for (const inquiry of inquiries) {
    try {
      await sql.query(`
        INSERT INTO inquiries (
          id, product_id, name, email, company, phone, country,
          message, status, created_at, updated_at, admin_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          company = EXCLUDED.company,
          phone = EXCLUDED.phone,
          country = EXCLUDED.country,
          message = EXCLUDED.message,
          status = EXCLUDED.status,
          admin_notes = EXCLUDED.admin_notes
      `, [
        inquiry.id,
        inquiry.product_id,
        inquiry.name,
        inquiry.email,
        inquiry.company,
        inquiry.phone,
        inquiry.country,
        inquiry.message,
        inquiry.status,
        inquiry.created_at,
        inquiry.updated_at,
        inquiry.admin_notes
      ])
      console.log(`  ✓ Imported inquiry from ${inquiry.email}`)
    } catch (error) {
      console.error(`  ✗ Failed to import inquiry ${inquiry.id}:`, error.message)
    }
  }

  console.log(`✅ Imported ${inquiries.length} inquiries\n`)
}

async function importSettings() {
  console.log('Importing settings...')
  const settings = JSON.parse(await fs.readFile('migrate-settings.json', 'utf-8'))

  for (const setting of settings) {
    try {
      // Convert value to JSON string for PostgreSQL JSONB type
      const value = typeof setting.value === 'string'
        ? JSON.stringify(setting.value)  // Wrap string in quotes for JSONB
        : JSON.stringify(setting.value)  // Already an object, stringify it

      await sql.query(`
        INSERT INTO website_settings (id, key, value, updated_at)
        VALUES ($1, $2, $3::jsonb, $4)
        ON CONFLICT (id) DO UPDATE SET
          key = EXCLUDED.key,
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
      `, [
        setting.id,
        setting.key,
        value,
        setting.updated_at
      ])
      console.log(`  ✓ Imported setting: ${setting.key}`)
    } catch (error) {
      console.error(`  ✗ Failed to import setting ${setting.key}:`, error.message)
    }
  }

  console.log(`✅ Imported ${settings.length} settings\n`)
}

async function main() {
  console.log('🚀 Starting data import to Neon...\n')

  try {
    await importProducts()
    await importInquiries()
    await importSettings()

    console.log('🎉 All data imported successfully!')
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

main()
