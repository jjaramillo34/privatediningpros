#!/usr/bin/env node

/**
 * Script to create database indexes for optimal query performance
 * Run this after deploying to production or when performance is slow
 * 
 * Usage: node scripts/create-indexes.js
 */

const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const restaurantsCollection = db.collection('restaurants');

    console.log('\n📊 Creating indexes for restaurants collection...\n');

    // Create indexes
    const indexes = [
      {
        name: 'status_createdAt',
        spec: { status: 1, createdAt: -1 },
        description: 'For status filtering + sorting by date'
      },
      {
        name: 'featured',
        spec: { featured: 1 },
        description: 'For featured restaurants query'
      },
      {
        name: 'name',
        spec: { name: 1 },
        description: 'For name searches and sorting'
      },
      {
        name: 'neighborhood',
        spec: { neighborhood: 1 },
        description: 'For location filtering'
      },
      {
        name: 'category',
        spec: { category: 1 },
        description: 'For category filtering'
      },
      {
        name: 'rating',
        spec: { rating: -1 },
        description: 'For rating sorting'
      },
      {
        name: 'place_id',
        spec: { place_id: 1 },
        description: 'For unique identification'
      },
      {
        name: 'google_id',
        spec: { google_id: 1 },
        description: 'For Google Maps integration'
      }
    ];

    for (const index of indexes) {
      try {
        await restaurantsCollection.createIndex(index.spec, { name: index.name });
        console.log(`✅ Created index: ${index.name}`);
        console.log(`   ${index.description}`);
      } catch (error) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
          console.log(`⚠️  Index ${index.name} already exists (skipping)`);
        } else {
          console.error(`❌ Error creating index ${index.name}:`, error.message);
        }
      }
    }

    // Show existing indexes
    console.log('\n📋 Current indexes on restaurants collection:');
    const existingIndexes = await restaurantsCollection.indexes();
    existingIndexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    // Get collection stats
    console.log('\n📊 Collection Statistics:');
    const stats = await restaurantsCollection.stats();
    console.log(`   Total documents: ${stats.count.toLocaleString()}`);
    console.log(`   Storage size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Average document size: ${(stats.avgObjSize / 1024).toFixed(2)} KB`);
    console.log(`   Total indexes: ${stats.nindexes}`);
    console.log(`   Total index size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n✅ Index creation completed successfully!');
    console.log('💡 Tip: Run this script periodically to ensure optimal performance\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createIndexes();

