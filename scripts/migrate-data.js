/**
 * Data Migration Script: Supabase -> Neon
 * Fetch all data from Supabase and prepare for Neon import
 */

// Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables before running
// Example: SUPABASE_URL="https://..." SUPABASE_ANON_KEY="..." node scripts/migrate-data.js
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required')
  process.exit(1)
}

const fs = require('fs').promises

async function fetchFromSupabase(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${table}: ${response.statusText}`)
  }

  return response.json()
}

async function main() {
  console.log('Fetching data from Supabase...\n')

  try {
    // Fetch products
    console.log('Fetching products...')
    const products = await fetchFromSupabase('products')
    console.log(`Found ${products.length} products`)

    // Fetch inquiries
    console.log('Fetching inquiries...')
    const inquiries = await fetchFromSupabase('inquiries')
    console.log(`Found ${inquiries.length} inquiries`)

    // Fetch settings
    console.log('Fetching website_settings...')
    const settings = await fetchFromSupabase('website_settings')
    console.log(`Found ${settings.length} settings`)

    // Write to files
    await fs.writeFile('migrate-products.json', JSON.stringify(products, null, 2))
    await fs.writeFile('migrate-inquiries.json', JSON.stringify(inquiries, null, 2))
    await fs.writeFile('migrate-settings.json', JSON.stringify(settings, null, 2))

    console.log('\n✅ Data exported to:')
    console.log('  - migrate-products.json')
    console.log('  - migrate-inquiries.json')
    console.log('  - migrate-settings.json')

    // Show sample data
    if (products.length > 0) {
      console.log('\n📦 Sample product:', JSON.stringify(products[0], null, 2))
    }
    if (inquiries.length > 0) {
      console.log('\n📨 Sample inquiry:', JSON.stringify(inquiries[0], null, 2))
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
