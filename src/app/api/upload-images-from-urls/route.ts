import { NextRequest, NextResponse } from 'next/server';
import { uploadImagesFromUrls } from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const { images, restaurantName, folder } = await request.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Images array is required' },
        { status: 400 }
      );
    }

    if (!restaurantName) {
      return NextResponse.json(
        { success: false, error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    // Limit to 10 images to avoid overwhelming the system
    const limitedImages = images.slice(0, 10);

    // Upload images to ImageKit
    const uploadResults = await uploadImagesFromUrls(
      limitedImages,
      restaurantName,
      folder || '/restaurants'
    );

    return NextResponse.json({
      success: true,
      data: uploadResults,
      count: uploadResults.length,
      message: `Successfully uploaded ${uploadResults.length} images`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
