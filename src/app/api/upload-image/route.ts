import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToImageKit } from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || '/restaurants';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const uploadResult = await uploadImageToImageKit(
      buffer,
      file.name,
      folder
    );

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        name: uploadResult.name,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
