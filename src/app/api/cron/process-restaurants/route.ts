import { NextRequest, NextResponse } from 'next/server';
import { processPendingRestaurants } from '@/lib/background-jobs';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron service (optional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Process pending restaurants
    const result = await processPendingRestaurants();

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in cron process-restaurants route:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for external cron services
export async function POST(request: NextRequest) {
  return GET(request);
}
