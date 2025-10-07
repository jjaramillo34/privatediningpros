'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';
import { IRestaurantImage } from '@/lib/restaurant.model';

interface RestaurantImageGalleryProps {
  images: IRestaurantImage[];
  restaurantName: string;
}

export default function RestaurantImageGallery({ images, restaurantName }: RestaurantImageGalleryProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Camera className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-600 mr-2 sm:mr-3" />
          Photo Gallery
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
      </div>
      
      {/* 4-Image Landscape Gallery */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="relative group aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              src={image.url}
              alt={image.alt || `${restaurantName} - Image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                <Camera className="h-4 w-4 text-gray-700" />
              </div>
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {images.length > 4 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            +{images.length - 4} more photos available
          </p>
        </div>
      )}
    </div>
  );
}
