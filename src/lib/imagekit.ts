import ImageKit from 'imagekit';

// Initialize ImageKit with environment variables
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_hPmDEPhApvNGandlgtntptGxBaA=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_iWUkT2CDbrIDpVQ7sOHPFdcWsJs=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/0swl5sj3l',
});

export default imagekit;

// Helper function to upload image to ImageKit
export async function uploadImageToImageKit(
  file: Buffer | string,
  fileName: string,
  folder?: string
): Promise<{ url: string; fileId: string; name: string }> {
  try {
    const uploadResult = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder || '/restaurants',
      useUniqueFileName: true,
    });

    return {
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      name: uploadResult.name,
    };
  } catch (error) {
    throw new Error('Failed to upload image to ImageKit');
  }
}

// Helper function to upload multiple images from URLs to ImageKit
export async function uploadImagesFromUrls(
  images: Array<{
    url: string;
    alt?: string;
    title?: string;
    source?: string;
    website?: {
      url?: string;
      title?: string;
      name?: string;
    };
    dimensions?: {
      width?: number;
      height?: number;
    };
    position?: number;
  }>,
  restaurantName: string,
  folder?: string
): Promise<Array<{
  url: string;
  fileId: string;
  name: string;
  originalUrl: string;
  alt?: string;
  title?: string;
  source?: string;
  website?: {
    url?: string;
    title?: string;
    name?: string;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
  position?: number;
}>> {
  const uploadPromises = images.map(async (imageData, index) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageData.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Generate a filename based on restaurant name and index
      const fileName = `${restaurantName.replace(/[^a-zA-Z0-9]/g, '_')}_image_${index + 1}.jpg`;
      
      // Upload to ImageKit
      const uploadResult = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: folder || '/restaurants',
        useUniqueFileName: true,
      });

      return {
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        name: uploadResult.name,
        originalUrl: imageData.url,
        alt: imageData.alt,
        title: imageData.title,
        source: imageData.source,
        website: imageData.website,
        dimensions: imageData.dimensions,
        position: imageData.position || index + 1,
      };
    } catch (error) {
      // Return null for failed uploads, we'll filter them out later
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);
  // Filter out failed uploads
  return results.filter((result): result is NonNullable<typeof result> => result !== null);
}

// Helper function to delete image from ImageKit
export async function deleteImageFromImageKit(fileId: string): Promise<boolean> {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to get ImageKit URL with transformations
export function getImageKitUrl(
  fileId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  }
): string {
  let url = `${process.env.IMAGEKIT_URL_ENDPOINT}/${fileId}`;
  
  if (transformations) {
    const params = new URLSearchParams();
    
    if (transformations.width) params.append('w', transformations.width.toString());
    if (transformations.height) params.append('h', transformations.height.toString());
    if (transformations.quality) params.append('q', transformations.quality.toString());
    if (transformations.format) params.append('f', transformations.format);
    if (transformations.crop) params.append('c', transformations.crop);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  return url;
}
