#!/bin/bash

# Migration script using mongorestore (more efficient for large datasets)
# Make sure you have MongoDB tools installed: brew install mongodb/brew/mongodb-database-tools

echo "🔄 Starting data migration to production MongoDB Atlas..."

# Check if MONGODB_URI is set
if [ -z "$MONGODB_URI" ]; then
    echo "❌ Please set MONGODB_URI environment variable"
    echo "Example: export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/database'"
    exit 1
fi

# Create a temporary directory for the backup
TEMP_DIR="./temp_backup"
mkdir -p "$TEMP_DIR"

echo "📖 Converting JSON backup to BSON format..."

# Convert the JSON file to a format that mongorestore can understand
# Create a restaurants collection file
jq -c '.[]' privatediningpros.restaurants.json > "$TEMP_DIR/restaurants.json"

# Convert to BSON (this requires mongoimport or we can use the Node.js script)
echo "📥 Importing data to production database..."

# Use mongoimport to import the data
mongoimport --uri="$MONGODB_URI" \
    --collection=restaurants \
    --file="$TEMP_DIR/restaurants.json" \
    --jsonArray \
    --drop

if [ $? -eq 0 ]; then
    echo "✅ Data migration completed successfully!"
    echo "📊 All restaurants have been imported to production database"
else
    echo "❌ Migration failed. Please check your MongoDB URI and network connection."
fi

# Clean up
rm -rf "$TEMP_DIR"
echo "🧹 Cleanup completed"
