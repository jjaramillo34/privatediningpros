# Neighborhood Geofencing Scripts

This directory contains scripts to update restaurant neighborhood information using the New York City neighborhood GeoJSON data.

## Files

- `update-neighborhoods.js` - Basic script to update neighborhoods
- `update-neighborhoods-advanced.js` - Advanced script with more options
- `test-geofencing.js` - Test script to verify geofencing works correctly
- `README-neighborhoods.md` - This documentation file

## Prerequisites

1. Make sure you have the `newyork.geojson` file in `src/data/`
2. Ensure your MongoDB connection is configured in `.env`
3. Install dependencies: `npm install`

## Usage

### 1. Test the Geofencing (Recommended First Step)

```bash
node scripts/test-geofencing.js
```

This will test the geofencing algorithm with known NYC locations to ensure it's working correctly.

### 2. Basic Neighborhood Update

```bash
node scripts/update-neighborhoods.js
```

This will:
- Connect to MongoDB
- Load the GeoJSON neighborhood data
- Find all restaurants with coordinates
- Update their neighborhood field based on their location
- Also update the city field with the borough if it's generic

### 3. Advanced Neighborhood Update

```bash
# Dry run (see what would be updated without making changes)
node scripts/update-neighborhoods-advanced.js --dry-run

# Update with detailed logging
node scripts/update-neighborhoods-advanced.js --log-file neighborhood-update.log

# Only update restaurants in Manhattan
node scripts/update-neighborhoods-advanced.js --borough Manhattan

# Force update restaurants that already have neighborhood data
node scripts/update-neighborhoods-advanced.js --force-update

# Don't update the city field
node scripts/update-neighborhoods-advanced.js --no-update-city
```

#### Advanced Options

- `--dry-run` - Show what would be updated without making changes
- `--no-update-city` - Don't update the city field with borough
- `--log-file <file>` - Write detailed logs to file
- `--borough <name>` - Only process neighborhoods in specified borough
- `--force-update` - Update restaurants that already have neighborhood
- `--help` - Show help message

## How It Works

1. **Point-in-Polygon Algorithm**: Uses the ray casting algorithm to determine if a restaurant's coordinates fall within a neighborhood polygon.

2. **Coordinate Validation**: Checks that coordinates are valid numbers within reasonable bounds.

3. **NYC Area Check**: Verifies coordinates are within the NYC metropolitan area.

4. **Neighborhood Matching**: Finds the neighborhood polygon that contains the restaurant's coordinates.

5. **Database Update**: Updates the restaurant record with:
   - `neighborhood`: The neighborhood name
   - `city`: The borough (if city is generic or missing)

## Example Output

```
✅ Connected to MongoDB
📁 Loaded GeoJSON with 195 neighborhoods
🏪 Found 150 restaurants with coordinates

✅ Updated STK Steakhouse Downtown NYC: Meatpacking District, Manhattan
✅ Updated Le Bernardin: Midtown, Manhattan
✅ Updated Peter Luger: Williamsburg, Brooklyn
❌ No neighborhood found for Some Restaurant at (-73.123, 40.456)

📊 Summary:
✅ Updated: 145 restaurants
❌ Not found: 3 restaurants
⚠️  Errors: 2 restaurants
```

## Troubleshooting

### No Neighborhood Found
- Check if coordinates are valid and within NYC bounds
- Verify the restaurant is actually in NYC
- Some areas might not be covered by the neighborhood polygons

### Invalid Coordinates
- Ensure latitude and longitude are numbers
- Check coordinate format (longitude, latitude)
- Verify coordinates are within valid ranges

### MongoDB Connection Issues
- Check your `.env` file has `MONGODB_URI` set
- Ensure MongoDB is running and accessible
- Verify database permissions

## Data Source

The neighborhood data comes from the NYC Department of City Planning and includes:
- 195+ neighborhoods across all 5 boroughs
- Precise polygon boundaries
- Borough information
- Neighborhood names

## Safety Features

- **Dry Run Mode**: Test changes without modifying the database
- **Coordinate Validation**: Prevents invalid coordinates from being processed
- **NYC Area Check**: Only processes coordinates within NYC bounds
- **Error Handling**: Continues processing even if individual restaurants fail
- **Detailed Logging**: Track what was updated and what failed
- **Skip Existing**: Option to skip restaurants that already have neighborhood data

## Performance

- Processes restaurants in batches
- Uses efficient point-in-polygon algorithm
- Minimal memory usage
- Typically processes 100-200 restaurants per minute

## Backup Recommendation

Before running the update script, consider backing up your restaurant data:

```bash
mongodump --db your_database_name --collection restaurants --out backup/
```
