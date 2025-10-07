import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET(request: NextRequest) {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_hPmDEPhApvNGandlgtntptGxBaA=',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_iWUkT2CDbrIDpVQ7sOHPFdcWsJs=',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/0swl5sj3l',
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}
