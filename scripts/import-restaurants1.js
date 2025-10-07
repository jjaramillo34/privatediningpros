// Only trigger the import by making a POST request to the API endpoint
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function importRestaurants() {
  try {
    const response = await fetch('http://localhost:3000/api/import-restaurants1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (result.success) {
      console.log('✅ Import completed successfully!');
      console.log(`📊 Imported: ${result.imported} restaurants`);
      console.log(`⏭️  Skipped: ${result.skipped} restaurants (already exist)`);
      if (result.errors && result.errors.length > 0) {
        console.log('❌ Errors:');
        result.errors.forEach(error => console.log(`   - ${error}`));
      }
    } else {
      console.error('❌ Import failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during import:', error);
  }
}

importRestaurants(); 