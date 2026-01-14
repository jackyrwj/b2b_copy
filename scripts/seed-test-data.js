/**
 * Seed Test Data for Neon Database
 * B2B Product Exhibition Website
 */

const { neon } = require('@neondatabase/serverless')

// Set NEON_DATABASE_URL environment variable before running this script
// Example: NEON_DATABASE_URL="postgresql://..." node scripts/seed-test-data.js
const NEON_URL = process.env.NEON_DATABASE_URL
if (!NEON_URL) {
  console.error('Error: NEON_DATABASE_URL environment variable is required')
  process.exit(1)
}

const sql = neon(NEON_URL)

// Test products with Unsplash images
const products = [
  // Industrial Automation (工业自动化)
  {
    name: "Robotic Arm System X-2000",
    description: "High-precision 6-axis robotic arm for industrial automation",
    detailed_description: "The X-2000 is a state-of-the-art 6-axis robotic arm designed for precision manufacturing. With repeatability of ±0.02mm and payload capacity of 20kg, it's perfect for assembly, welding, and material handling applications.",
    specifications: JSON.stringify({
      payload: "20kg",
      reach: "1.8m",
      repeatability: "±0.02mm",
      axes: 6,
      power: "3.5kW"
    }),
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    category: "Industrial Automation",
    subcategory: "Robotics",
    price: 45000,
    stock_quantity: 5,
    is_featured: true,
    is_active: true
  },
  {
    name: "CNC Machining Center Pro-500",
    description: "Advanced CNC machine for precision metal cutting",
    detailed_description: "The Pro-500 CNC machining center offers superior performance for complex part manufacturing. Features include 5-axis simultaneous machining, high-speed spindle, and advanced control system.",
    specifications: JSON.stringify({
      workArea: "500x500x400mm",
      spindle: "15000 RPM",
      axes: "5-axis simultaneous",
      control: "Siemens 828D",
      power: "15kW"
    }),
    image_url: "https://images.unsplash.com/photo-1565439398-0454c814cbbd?w=800",
    category: "Industrial Automation",
    subcategory: "CNC Machines",
    price: 125000,
    stock_quantity: 3,
    is_featured: true,
    is_active: true
  },
  {
    name: "Automated Conveyor System",
    description: "Modular conveyor belt system for factory automation",
    detailed_description: "Flexible conveyor system designed for material handling in manufacturing plants. Easy to configure and expand based on your production needs.",
    specifications: JSON.stringify({
      length: "10-100m customizable",
      speed: "0.5-2m/s",
      loadCapacity: "500kg/m",
      material: "Aluminum/Steel",
      width: "400-1200mm"
    }),
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    category: "Industrial Automation",
    subcategory: "Material Handling",
    price: 25000,
    stock_quantity: 8,
    is_featured: false,
    is_active: true
  },

  // IoT & Sensors (物联网与传感器)
  {
    name: "Industrial IoT Gateway Elite",
    description: "Edge computing gateway for IIoT applications",
    detailed_description: "Connect and manage up to 200 sensors with our industrial IoT gateway. Features rugged design, wide operating temperature range, and support for multiple industrial protocols.",
    specifications: JSON.stringify({
      protocols: "Modbus, OPC-UA, MQTT",
      ports: "8x Ethernet, 4x RS485",
      operatingTemp: "-40°C to 70°C",
      rating: "IP67",
      processors: "Quad-core ARM Cortex"
    }),
    image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    category: "IoT & Sensors",
    subcategory: "Gateways",
    price: 3500,
    stock_quantity: 25,
    is_featured: true,
    is_active: true
  },
  {
    name: "Wireless Temperature Sensor Node",
    description: "Battery-powered wireless sensor for temperature monitoring",
    detailed_description: "Long-range wireless temperature sensor with 10-year battery life. Perfect for cold chain monitoring, warehouse management, and industrial process control.",
    specifications: JSON.stringify({
      range: "-40°C to 125°C",
      accuracy: "±0.3°C",
      wireless: "LoRaWAN",
      battery: "10 years",
      rating: "IP68"
    }),
    image_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800",
    category: "IoT & Sensors",
    subcategory: "Temperature Sensors",
    price: 150,
    stock_quantity: 100,
    is_featured: false,
    is_active: true
  },
  {
    name: "Smart Vibration Monitor",
    description: "Real-time vibration monitoring for predictive maintenance",
    detailed_description: "Advanced vibration sensor with AI-powered anomaly detection. Identify equipment failures before they happen with continuous monitoring and analytics.",
    specifications: JSON.stringify({
      frequency: "0-10kHz",
      sensitivity: "100mV/g",
      communication: "4-20mA + Modbus",
      operatingTemp: "-20°C to 60°C",
      display: "OLED"
    }),
    image_url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800",
    category: "IoT & Sensors",
    subcategory: "Vibration Sensors",
    price: 850,
    stock_quantity: 50,
    is_featured: true,
    is_active: true
  },

  // Power Systems (电力系统)
  {
    name: "Industrial UPS System 10kVA",
    description: "Online double-conversion UPS for critical infrastructure",
    detailed_description: "Reliable power backup for industrial applications. Features online double-conversion technology, automatic bypass, and hot-swappable batteries.",
    specifications: JSON.stringify({
      power: "10kVA / 9kW",
      runtime: "30 min at full load",
      voltage: "208/220/230/240V",
      waveform: "Pure sine wave",
      efficiency: "95%"
    }),
    image_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    category: "Power Systems",
    subcategory: "UPS",
    price: 8500,
    stock_quantity: 15,
    is_featured: false,
    is_active: true
  },
  {
    name: "Solar Inverter 50kW Grid-Tie",
    description: "High-efficiency solar inverter for commercial installations",
    detailed_description: "Three-phase grid-tie solar inverter with 98.5% peak efficiency. Ideal for commercial and industrial solar installations.",
    specifications: JSON.stringify({
      power: "50kW",
      efficiency: "98.5%",
      inputs: "4 MPPT trackers",
      voltage: "380-415V three-phase",
      protection: "IP65"
    }),
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    category: "Power Systems",
    subcategory: "Solar Inverters",
    price: 12000,
    stock_quantity: 12,
    is_featured: true,
    is_active: true
  },
  {
    name: "Industrial Transformer 500kVA",
    description: "Three-phase dry-type transformer for industrial use",
    detailed_description: "High-efficiency dry-type transformer with low losses and compact design. Perfect for industrial facilities requiring reliable power distribution.",
    specifications: JSON.stringify({
      power: "500kVA",
      primary: "11kV",
      secondary: "400V",
      phases: 3,
      efficiency: "97.5%"
    }),
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    category: "Power Systems",
    subcategory: "Transformers",
    price: 28000,
    stock_quantity: 6,
    is_featured: false,
    is_active: true
  },

  // Control Systems (控制系统)
  {
    name: "PLC Controller S7-1500 Series",
    description: "Advanced programmable logic controller for automation",
    detailed_description: "High-performance PLC with integrated safety functions. Supports up to 32 expansion modules and features comprehensive communication interfaces.",
    specifications: JSON.stringify({
      memory: "1MB work, 4MB load",
      digitalIO: "256 inputs/256 outputs",
      analogIO: "64 inputs/64 outputs",
      communication: "PROFINET, Modbus TCP",
      programming: "IEC 61131-3"
    }),
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    category: "Control Systems",
    subcategory: "PLC",
    price: 5500,
    stock_quantity: 20,
    is_featured: true,
    is_active: true
  },
  {
    name: "HMI Touch Panel 15-inch",
    description: "Industrial human-machine interface with multi-touch",
    detailed_description: "15-inch capacitive touch HMI panel with rugged design. Features intuitive visualization software and remote access capabilities.",
    specifications: JSON.stringify({
      display: "15\" LCD, 1920x1080",
      processor: "Quad-core 1.5GHz",
      memory: "4GB RAM, 32GB flash",
      communication: "Ethernet, USB, RS485",
      rating: "IP65 front"
    }),
    image_url: "https://images.unsplash.com/photo-1563770095122-2c456c8b3cc4?w=800",
    category: "Control Systems",
    subcategory: "HMI",
    price: 2200,
    stock_quantity: 30,
    is_featured: false,
    is_active: true
  },
  {
    name: "Safety Light Curtain System",
    description: "Optical safety sensor for machine guarding",
    detailed_description: "Type 4 safety light curtain for personnel protection. Fast response time and easy alignment make it ideal for press machines and robotic workcells.",
    specifications: JSON.stringify({
      height: "900-1500mm adjustable",
      resolution: "14mm beam spacing",
      responseTime: "<15ms",
      safetyLevel: "SIL 3, PL e",
      range: "0.3-10m"
    }),
    image_url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800",
    category: "Control Systems",
    subcategory: "Safety Systems",
    price: 1800,
    stock_quantity: 18,
    is_featured: false,
    is_active: true
  },

  // Hydraulic & Pneumatic (液压气动)
  {
    name: "Hydraulic Power Unit 10HP",
    description: "Industrial hydraulic power unit for heavy machinery",
    detailed_description: "Complete hydraulic power system with 10HP motor. Designed for press machines, lifts, and other industrial hydraulic applications.",
    specifications: JSON.stringify({
      power: "10HP (7.5kW)",
      flowRate: "20 L/min",
      pressure: "210 bar",
      tank: "100L",
      voltage: "380V 3-phase"
    }),
    image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
    category: "Hydraulic & Pneumatic",
    subcategory: "Hydraulic Power",
    price: 6500,
    stock_quantity: 10,
    is_featured: true,
    is_active: true
  },
  {
    name: "Pneumatic Cylinder Series",
    description: "ISO standard pneumatic cylinders for automation",
    detailed_description: "High-quality pneumatic cylinders compliant with ISO 15552. Available in various bore sizes and stroke lengths for different applications.",
    specifications: JSON.stringify({
      boreSize: "32-100mm",
      stroke: "25-500mm",
      pressure: "1-10 bar",
      mountings: "ISO standard",
      material: "Aluminum alloy"
    }),
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    category: "Hydraulic & Pneumatic",
    subcategory: "Pneumatic Actuators",
    price: 180,
    stock_quantity: 80,
    is_featured: false,
    is_active: true
  },
  {
    name: "Air Compressor 50HP Rotary Screw",
    description: "Industrial rotary screw air compressor",
    detailed_description: "50HP rotary screw compressor for continuous industrial operation. Features variable speed drive and energy-efficient design.",
    specifications: JSON.stringify({
      power: "50HP (37kW)",
      flowRate: "250 CFM",
      pressure: "125 psi",
      tank: "500 gallon",
      phase: "3-phase"
    }),
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    category: "Hydraulic & Pneumatic",
    subcategory: "Compressors",
    price: 18500,
    stock_quantity: 7,
    is_featured: true,
    is_active: true
  },

  // Material Handling (物料搬运)
  {
    name: "Electric Forklift 3 Ton",
    description: "Heavy-duty electric forklift for warehouse operations",
    detailed_description: "3-ton electric forklift with advanced lithium battery technology. Zero emissions and low operating costs make it ideal for indoor warehouse applications.",
    specifications: JSON.stringify({
      capacity: "3000kg",
      liftHeight: "6 meters",
      battery: "80V 400Ah lithium",
      turningRadius: "2.8m",
      mast: "Duplex 2-stage"
    }),
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    category: "Material Handling",
    subcategory: "Forklifts",
    price: 35000,
    stock_quantity: 4,
    is_featured: true,
    is_active: true
  },
  {
    name: "Automated Storage Retrieval System",
    description: "AS/RS for high-density warehouse storage",
    detailed_description: "Complete automated storage and retrieval system. Maximizes warehouse space utilization while improving picking accuracy and speed.",
    specifications: JSON.stringify({
      height: "10-30m customizable",
      capacity: "50-1000kg per tray",
      speed: "200m/min",
      positions: "100-1000+ locations",
      automation: "Fully automated"
    }),
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    category: "Material Handling",
    subcategory: "AS/RS",
    price: 150000,
    stock_quantity: 2,
    is_featured: true,
    is_active: true
  },
  {
    name: "Pallet Jack 2 Ton Electric",
    description: "Electric pallet jack for material transport",
    detailed_description: "Compact electric pallet jack with 2-ton capacity. Perfect for loading docks, warehouse aisles, and manufacturing floors.",
    specifications: JSON.stringify({
      capacity: "2000kg",
      liftHeight: "200mm",
      forks: "1150x180mm",
      battery: "24V",
      turningRadius: "1.5m"
    }),
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    category: "Material Handling",
    subcategory: "Pallet Jacks",
    price: 3500,
    stock_quantity: 25,
    is_featured: false,
    is_active: true
  }
]

// Test inquiries
const inquiries = [
  {
    name: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Manufacturing",
    phone: "+1-555-0101",
    country: "United States",
    message: "We're interested in the Robotic Arm System X-2000 for our assembly line. Can you provide technical specifications and delivery lead time?",
    status: "pending",
    product_id: 1
  },
  {
    name: "Maria Garcia",
    email: "m.garcia@automate.es",
    company: "Automate España S.L.",
    phone: "+34-91-123-4567",
    country: "Spain",
    message: "Looking for 5 units of the IoT Gateway Elite for our smart factory project. Do you offer volume discounts?",
    status: "pending",
    product_id: 4
  },
  {
    name: "Hiroshi Tanaka",
    email: "tanaka@japanese-tech.co.jp",
    company: "Japanese Tech Co.",
    phone: "+81-3-1234-5678",
    country: "Japan",
    message: "Need quotation for PLC S7-1500 with expansion modules. We need this delivered within 4 weeks.",
    status: "processing",
    product_id: 10
  },
  {
    name: "Anna Mueller",
    email: "a.mueller@german-engineering.de",
    company: "German Engineering GmbH",
    phone: "+49-30-9876-5432",
    country: "Germany",
    message: "Inquiry about CNC Machining Center Pro-500. What's included in the standard package? Any warranty options?",
    status: "pending",
    product_id: 2
  },
  {
    name: "Chen Wei",
    email: "chen.wei@china-mfg.cn",
    company: "China Manufacturing Solutions",
    phone: "+86-21-8765-4321",
    country: "China",
    message: "We need 10 electric forklifts. What's your best price for bulk order? Can you provide shipping to Shanghai?",
    status: "completed",
    product_id: 13
  },
  {
    name: "David Brown",
    email: "d.brown@logistics-uk.com",
    company: "British Logistics Ltd",
    phone: "+44-20-7946-0123",
    country: "United Kingdom",
    message: "Interested in your automated conveyor system. Can you send a catalog with all available configurations?",
    status: "pending",
    product_id: null
  },
  {
    name: "Sophie Martin",
    email: "s.martin@french-industrie.fr",
    company: "Industrie France S.A.",
    phone: "+33-1-42-86-53-79",
    country: "France",
    message: "We need a complete quote for AS/RS system for our new warehouse. Can you arrange a site visit?",
    status: "processing",
    product_id: 14
  },
  {
    name: "Raj Patel",
    email: "raj.patel@india-tech.in",
    company: "India Tech Solutions",
    phone: "+91-22-2345-6789",
    country: "India",
    message: "Need technical support for Solar Inverter 50kW. We're experiencing issues with grid synchronization.",
    status: "pending",
    product_id: 8
  }
]

async function seedProducts() {
  console.log('📦 Seeding products...\n')

  for (const product of products) {
    try {
      await sql.query(`
        INSERT INTO products (
          name, description, detailed_description, specifications,
          image_url, category, subcategory, price, stock_quantity,
          is_featured, is_active, slug
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        product.name,
        product.description,
        product.detailed_description,
        product.specifications,
        product.image_url,
        product.category,
        product.subcategory,
        product.price,
        product.stock_quantity,
        product.is_featured,
        product.is_active,
        product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      ])

      console.log(`  ✓ ${product.name} (${product.category})`)
    } catch (error) {
      console.error(`  ✗ Failed to insert ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ Inserted ${products.length} products\n`)
}

async function seedInquiries() {
  console.log('📨 Seeding inquiries...\n')

  for (const inquiry of inquiries) {
    try {
      await sql.query(`
        INSERT INTO inquiries (
          product_id, name, email, company, phone, country, message, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        inquiry.product_id,
        inquiry.name,
        inquiry.email,
        inquiry.company,
        inquiry.phone,
        inquiry.country,
        inquiry.message,
        inquiry.status
      ])

      console.log(`  ✓ Inquiry from ${inquiry.name} (${inquiry.status})`)
    } catch (error) {
      console.error(`  ✗ Failed to insert inquiry:`, error.message)
    }
  }

  console.log(`\n✅ Inserted ${inquiries.length} inquiries\n`)
}

async function main() {
  console.log('🚀 Starting database seeding...\n')

  try {
    await seedProducts()
    await seedInquiries()

    console.log('🎉 Test data seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - Products: ${products.length}`)
    console.log(`  - Categories: ${[...new Set(products.map(p => p.category))].join(', ')}`)
    console.log(`  - Inquiries: ${inquiries.length}`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
