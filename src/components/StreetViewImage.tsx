'use client';

import { MapPin } from 'lucide-react';

interface StreetViewImageProps {
  streetViewUrl: string;
  restaurantName: string;
}

export default function StreetViewImage({ streetViewUrl, restaurantName }: StreetViewImageProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 mr-2 sm:mr-3" />
        Street View
      </h3>
      <div className="relative group">
        <img 
          src={streetViewUrl} 
          alt={`${restaurantName} street view`}
          className="w-full h-48 sm:h-56 object-cover rounded-lg border border-cyan-200 shadow-lg group-hover:shadow-xl transition-all duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <MapPin className="h-5 w-5 text-cyan-600" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <p className="text-xs sm:text-sm font-medium text-gray-900">Street View</p>
        </div>
      </div>
    </div>
  );
}
