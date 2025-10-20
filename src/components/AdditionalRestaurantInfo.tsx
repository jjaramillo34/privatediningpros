'use client';

import { Building2, Camera, Menu, ExternalLink, Utensils, Star } from 'lucide-react';
import { IRestaurant } from '@/lib/restaurant.model';

interface AdditionalRestaurantInfoProps {
  restaurant: IRestaurant;
}

export default function AdditionalRestaurantInfo({ restaurant }: AdditionalRestaurantInfoProps) {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">
            Additional Information
          </h2>
          <div className="w-40 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Cuisine Type */}
          {restaurant.category && (
            <div className="group bg-white rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Cuisine Type</h3>
              </div>
              <p className="text-xl text-gray-700 font-semibold">{restaurant.category}</p>
            </div>
          )}
        
          {/* Reviews */}
          {restaurant.reviews && (
            <div className="group bg-white rounded-2xl p-8 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="h-8 w-8 text-white fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
              </div>
              <p className="text-xl text-gray-700 font-semibold">{restaurant.reviews.toLocaleString()} reviews</p>
            </div>
          )}

          {/* Menu Link */}
          {restaurant.menu_link && (
            <div className="group bg-white rounded-2xl p-8 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Menu className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Menu</h3>
              </div>
              <a 
                href={restaurant.menu_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xl text-indigo-600 hover:text-indigo-800 font-semibold transition-colors group-hover:underline"
              >
                View Menu
                <ExternalLink className="h-6 w-6 ml-2" />
              </a>
            </div>
          )}

          {/* Logo URL */}
          {restaurant.logo && (
            <div className="group bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Logo</h3>
              </div>
              <div className="flex items-center space-x-6">
                <img 
                  src={restaurant.logo} 
                  alt={`${restaurant.name} logo`}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-purple-200 shadow-md group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1">
                  <p className="text-lg text-gray-600 font-medium">Official Restaurant Logo</p>
                </div>
              </div>
            </div>
          )}

          {/* Photo URL */}
          {restaurant.photo && (
            <div className="group bg-white rounded-2xl p-8 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Featured Photo</h3>
              </div>
              <div className="flex items-center space-x-6">
                <img 
                  src={restaurant.photo} 
                  alt={`${restaurant.name} featured photo`}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-pink-200 shadow-md group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1">
                  <p className="text-lg text-gray-600 font-medium">Main Restaurant Photo</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
