'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface RestaurantImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function RestaurantImage({ 
  src, 
  alt, 
  fill = true, 
  className = "object-cover", 
  sizes,
  priority = false 
}: RestaurantImageProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // If no image source or both original and fallback failed, show icon
  if (!src || (imageError && fallbackError)) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200">
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  // If original image failed, show fallback logo
  if (imageError) {
    return (
      <Image
        src="/logo_black.png"
        alt={`${alt} - PrivateDiningPros`}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFallbackError(true)}
      />
    );
  }

  // Show original image
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
} 