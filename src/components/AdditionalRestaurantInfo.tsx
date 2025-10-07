'use client';

import { Building2, Camera, Menu, ExternalLink, Utensils, Star } from 'lucide-react';
import { IRestaurant } from '@/lib/restaurant.model';

interface AdditionalRestaurantInfoProps {
  restaurant: IRestaurant;
}

export default function AdditionalRestaurantInfo({ restaurant }: AdditionalRestaurantInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
        Additional Information
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {/* Cuisine Type */}
        {restaurant.category && (
          <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-200">
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full mr-2 sm:mr-3">
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Cuisine Type</h4>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">{restaurant.category}</p>
          </div>
        )}
        
        {/* Reviews */}
        {restaurant.reviews && (
          <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 border border-yellow-200">
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-yellow-600 rounded-full mr-2 sm:mr-3">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Reviews</h4>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-sm sm:text-base">{restaurant.reviews} reviews</p>
          </div>
        )}

        {/* Menu Link */}
        {restaurant.menu_link && (
          <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full mr-2 sm:mr-3">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Menu</h4>
              </div>
            </div>
            <a 
              href={restaurant.menu_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 hover:text-indigo-800 font-medium text-sm sm:text-base flex items-center transition-colors"
            >
              View Menu
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </a>
          </div>
        )}

        {/* Logo URL */}
        {restaurant.logo && (
          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-200">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full mr-2 sm:mr-3">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Restaurant Logo</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src={restaurant.logo} 
                alt={`${restaurant.name} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-purple-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">Official logo</p>
              </div>
            </div>
          </div>
        )}

        {/* Photo URL */}
        {restaurant.photo && (
          <div className="bg-pink-50 rounded-xl p-3 sm:p-4 border border-pink-200">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-600 rounded-full mr-2 sm:mr-3">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Featured Photo</h4>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src={restaurant.photo} 
                alt={`${restaurant.name} featured photo`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-pink-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 truncate">Main restaurant photo</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
