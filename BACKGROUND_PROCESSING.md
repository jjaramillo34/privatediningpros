# Background Processing & Geolocation

This document describes the background processing and geolocation features added to the PrivateDiningPros application.

## Features Added

### 1. Enhanced Suggest Restaurant Form
- **Multi-step form** with 4 steps: Basic Info, Contact Details, Description, Additional Info
- **25+ comprehensive fields** covering all restaurant aspects
- **Real-time validation** and progress tracking
- **Geolocation feedback** showing if address was successfully geocoded

### 2. Automatic Geolocation
- **Google Maps API** integration (primary)
- **OpenStreetMap Nominatim** as fallback (free, no API key required)
- **Automatic coordinate extraction** from restaurant addresses
- **Formatted address standardization**

### 3. Background Processing System
- **Process pending restaurants** for geocoding
- **Validate and clean** restaurant data
- **Admin interface** for manual processing
- **Cron job support** for automated processing

## API Endpoints

### Suggest Restaurant
```
POST /api/suggest
```
Enhanced to capture all fields and automatically geocode addresses.

### Background Processing (Admin)
```
POST /api/admin/process-restaurants
```
Actions:
- `process-pending`: Geocode addresses for pending restaurants
- `geocode-restaurant`: Geocode a specific restaurant
- `validate-restaurant`: Clean and validate restaurant data

### Cron Job Endpoint
```
GET/POST /api/cron/process-restaurants
```
For automated background processing via external cron services.

## Environment Variables

Add these to your `.env.local`:

```bash
# Google Maps API (optional - will use Nominatim as fallback)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Cron job security (optional)
CRON_SECRET=your_secret_key_for_cron_jobs
```

## Setup Instructions

### 1. Google Maps API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Geocoding API
3. Create an API key
4. Add to environment variables

### 2. Automated Cron Jobs
You can set up automated processing using services like:
- **Vercel Cron Jobs** (if deployed on Vercel)
- **GitHub Actions**
- **External cron services** (cron-job.org, etc.)

Example cron job URL:
```
https://your-domain.com/api/cron/process-restaurants
```

### 3. Manual Processing
Admins can manually trigger background processing from the admin panel at `/admin`.

## Data Fields Captured

The enhanced suggest form now captures:

### Basic Information
- Restaurant name, address, city, state, country
- Neighborhood, postal code
- Full address (auto-generated from geocoding)

### Contact Details
- Phone, website, email
- Contact person

### Description & Details
- Full description, short description (150 chars)
- Cuisine type, price range, category
- Atmosphere

### Additional Information
- Private rooms and capacity
- Best for occasions, dress code
- Parking, accessibility
- Working hours (JSON format)
- Special features, additional notes
- Image URL

### Automatic Processing
- **Latitude/Longitude** (from geocoding)
- **Formatted address** (standardized)
- **Data validation** and cleaning

## Background Processing Features

### Geolocation Processing
- Processes restaurants missing coordinates
- Uses multiple geocoding services for reliability
- Handles rate limiting and errors gracefully
- Updates restaurant records with coordinates

### Data Validation
- Cleans phone numbers (removes non-digits)
- Validates and formats website URLs
- Validates rating ranges (0-5)
- Standardizes data formats

### Error Handling
- Graceful fallbacks when geocoding fails
- Detailed error logging
- Continues processing even if individual records fail
- User-friendly error messages

## Usage Examples

### Manual Processing (Admin Panel)
1. Go to `/admin`
2. Scroll to "Background Processing" section
3. Click "Process Pending Restaurants" to geocode addresses
4. Click "Validate Restaurant Data" to clean data

### Automated Processing (Cron)
Set up a cron job to call:
```
https://your-domain.com/api/cron/process-restaurants
```

### API Usage
```javascript
// Process pending restaurants
const response = await fetch('/api/admin/process-restaurants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'process-pending' })
});
```

## Benefits

1. **Complete Data Capture**: All restaurant information is now captured
2. **Automatic Geolocation**: No manual coordinate entry needed
3. **Data Quality**: Automatic validation and cleaning
4. **Scalable Processing**: Background jobs handle large datasets
5. **User Experience**: Real-time feedback on geocoding status
6. **Admin Efficiency**: Automated processing reduces manual work

## Monitoring

- Check admin panel for processing results
- Monitor server logs for geocoding status
- Use cron job monitoring services for automated tasks
- Review restaurant records for coordinate accuracy
