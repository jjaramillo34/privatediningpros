// ImageKit configuration for client-side components
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_hPmDEPhApvNGandlgtntptGxBaA=',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/0swl5sj3l',
  authenticationEndpoint: '/api/imagekit-auth',
  transformationPosition: 'path' as const,
};

// Validate configuration
export function validateImageKitConfig() {
  const errors = [];
  
  if (!imagekitConfig.publicKey) {
    errors.push('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not set');
  }
  
  if (!imagekitConfig.urlEndpoint) {
    errors.push('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set');
  }
  
  if (errors.length > 0) {
    return false;
  }
  
  return true;
}
