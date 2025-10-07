# Outscraper API Setup

This document explains how to set up the Outscraper API integration for automatic restaurant data fetching.

## What is Outscraper?

Outscraper is a web scraping API service that provides access to Google Maps data, including restaurant information, reviews, photos, and more. It's perfect for automatically populating restaurant data in our suggestion form.

## Setup Instructions

### 1. Get Outscraper API Key

1. Go to [Outscraper.com](https://outscraper.com/)
2. Sign up for an account
3. Navigate to your dashboard and find your API key
4. Copy your API key (it should look like: `N2JhMjJiODg5ZmQ5NDZlNGI0Y2ZiMzZlMTM0MDIxYTZ8MjE5Mjg2M2E0Mg`)

### 2. Add to Environment Variables

Add your Outscraper API key to your `.env.local` file:

```bash
# Outscraper API Key for restaurant data fetching
OUTSCRAPER_API_KEY=your_outscraper_api_key_here
```

### 3. Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

### User Experience

1. **Search**: Users can search for restaurants by name, type, or cuisine
2. **Results**: The system displays up to 20 matching restaurants with key information
3. **Selection**: Users can click "Use This Restaurant" to auto-populate the form
4. **Editing**: Users can then edit any auto-populated fields as needed

### Data Retrieved

The Outscraper API provides:
- ✅ Restaurant name and address
- ✅ Phone number and website
- ✅ Rating and review count
- ✅ Category/cuisine type
- ✅ Price range
- ✅ Latitude and longitude coordinates
- ✅ Working hours
- ✅ Photos (if available)
- ✅ Place ID for verification

### Auto-Population

When a user selects a restaurant, the form is automatically filled with:
- Basic information (name, address, contact details)
- Verified coordinates (no need for manual geocoding)
- Default private dining information
- Source tracking in the notes field

## API Endpoints

### Search Restaurants
```
POST /api/search-restaurants
```

**Request Body:**
```json
{
  "query": "Italian restaurants",
  "location": "Manhattan, NY, USA"
}
```

**Response:**
```json
{
  "success": true,
  "restaurants": [
    {
      "name": "Restaurant Name",
      "address": "123 Main St, New York, NY 10001",
      "phone": "+1 (555) 123-4567",
      "website": "https://restaurant.com",
      "rating": 4.5,
      "reviews": 150,
      "category": "Italian Restaurant",
      "price_range": "$$$",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "working_hours": {...},
      "place_id": "ChIJ..."
    }
  ],
  "count": 20
}
```

## Benefits

1. **Data Accuracy**: Verified restaurant information from Google Maps
2. **Time Saving**: No manual data entry required
3. **Completeness**: Automatic coordinates, contact info, and ratings
4. **User Experience**: Easy search and selection interface
5. **Quality Control**: Source tracking for data verification

## Cost Considerations

- Outscraper offers various pricing plans
- Typical cost: $0.01-0.05 per search request
- Each search returns up to 20 restaurants
- Consider implementing rate limiting for production use

## Error Handling

The system gracefully handles:
- Missing API key configuration
- API rate limits
- Network errors
- Invalid search queries
- Empty results

## Security

- API key is stored securely in environment variables
- No API key is exposed to the client-side
- All requests are made server-side for security

## Testing

To test the integration:

1. Add your API key to `.env.local`
2. Go to `/suggest` page
3. Search for "Italian restaurants Manhattan"
4. Select a restaurant from the results
5. Verify the form is auto-populated correctly

## Troubleshooting

### Common Issues

1. **"Outscraper API key not configured"**
   - Check that `OUTSCRAPER_API_KEY` is in your `.env.local` file
   - Restart your development server

2. **"Search failed"**
   - Verify your API key is correct
   - Check your Outscraper account balance
   - Ensure you have API access enabled

3. **No results found**
   - Try different search terms
   - Check the location format
   - Verify the restaurant exists on Google Maps

### Support

- Outscraper Documentation: [docs.outscraper.com](https://docs.outscraper.com)
- Outscraper Support: Available through their dashboard
