const fetch = require('node-fetch');

async function testEditFetch() {
  try {
    const restaurantId = '68d9620f03d6b7ca83ef0001';
    const url = `https://www.privatediningpros.com/api/restaurants/${restaurantId}`;
    
    console.log(`🔍 Testing fetch for: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Restaurant data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:');
      console.log(errorText);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testEditFetch();
