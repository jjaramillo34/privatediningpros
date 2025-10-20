'use client';

import { Star, MapPin, DollarSign, Utensils, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RestaurantHeroProps {
  restaurant: {
    name: string;
    short_description?: string;
    neighborhood?: string;
    rating?: number;
    price_range?: string;
    category?: string;
    featured?: boolean;
    images?: (string | { url: string })[];
  };
}

export default function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  const heroImage = restaurant.images && restaurant.images.length > 0 
    ? (typeof restaurant.images[0] === 'string' ? restaurant.images[0] : restaurant.images[0].url)
    : null;

  return (
    <>
      {/* Sticky Navigation Bar */}
      <div className="bg-white shadow-md border-b-2 border-gray-100 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Restaurants
            </Link>
            
            <div className="flex items-center space-x-3">
              {restaurant.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Featured
                </span>
              )}
              {restaurant.rating && (
                <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {restaurant.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        {heroImage ? (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
        )}
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="w-full px-4 sm:px-6 lg:px-4 xl:px-8">
            {/* Short Description Badge */}
            {restaurant.short_description && (
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 mb-4 shadow-lg">
                <p className="text-gray-800 font-medium">{restaurant.short_description}</p>
              </div>
            )}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {restaurant.name}
            </h1>

            {/* Info Badges */}
            <div className="flex flex-wrap gap-3">
              {restaurant.neighborhood && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center shadow-lg border border-white/30">
                  <MapPin className="h-5 w-5 text-white mr-2" />
                  <span className="text-white font-semibold">{restaurant.neighborhood}</span>
                </div>
              )}
              {restaurant.rating && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center shadow-lg border border-white/30">
                  <Star className="h-5 w-5 text-yellow-400 mr-2 fill-current" />
                  <span className="text-white font-semibold">{restaurant.rating}/5.0</span>
                </div>
              )}
              {restaurant.price_range && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center shadow-lg border border-white/30">
                  <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-white font-semibold">{restaurant.price_range}</span>
                </div>
              )}
              {restaurant.category && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center shadow-lg border border-white/30">
                  <Utensils className="h-5 w-5 text-orange-400 mr-2" />
                  <span className="text-white font-semibold">{restaurant.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

