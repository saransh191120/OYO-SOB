import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_WoYsuZ5PL7gA@ep-autumn-tree-a5fzm5kg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

const db = drizzle(pool, { schema });

async function main() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hotel_brands (
        id SERIAL PRIMARY KEY,
        brand_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT NOT NULL,
        target_audience TEXT NOT NULL,
        amenities TEXT NOT NULL,
        image_url TEXT NOT NULL,
        icon_class TEXT NOT NULL,
        rev_share_percentage INTEGER NOT NULL,
        default_rate INTEGER NOT NULL,
        locations TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        hotel TEXT NOT NULL,
        location TEXT NOT NULL,
        brand TEXT NOT NULL,
        quote TEXT NOT NULL,
        image_url TEXT NOT NULL,
        rating INTEGER NOT NULL,
        featured INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        hotel_name TEXT NOT NULL,
        location TEXT NOT NULL,
        rooms INTEGER NOT NULL,
        brand_preference TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS calculator_results (
        id SERIAL PRIMARY KEY,
        brand_id TEXT NOT NULL,
        room_rate INTEGER NOT NULL,
        stay_duration INTEGER NOT NULL,
        number_of_rooms INTEGER NOT NULL,
        occupancy_rate INTEGER NOT NULL,
        total_revenue DOUBLE PRECISION NOT NULL,
        rev_share DOUBLE PRECISION NOT NULL,
        user_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables created successfully!');

    // Insert sample hotel brand
    await db.insert(schema.hotelBrands).values({
      brandId: 'oyo-premium',
      name: 'OYO Premium',
      tagline: 'Luxury Comfort at Affordable Prices',
      description: 'Experience premium hospitality without breaking the bank',
      targetAudience: 'Business travelers and luxury seekers',
      amenities: 'WiFi, AC, TV, Room Service, Restaurant',
      imageUrl: '/images/premium-hotel.jpg',
      iconClass: 'fa-star',
      revSharePercentage: 20,
      defaultRate: 100,
      locations: 'Major cities worldwide'
    });

    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main(); 