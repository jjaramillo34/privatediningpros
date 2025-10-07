import HomePage from './HomePage';

async function getRestaurants() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/restaurants`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

export default async function Home() {
  const restaurants = await getRestaurants();
  return <HomePage restaurants={restaurants} />;
}
