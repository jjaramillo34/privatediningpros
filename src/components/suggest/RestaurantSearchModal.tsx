'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Phone, Globe, X } from 'lucide-react';

interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviews: number;
  category: string;
  price_range: string;
  phone: string;
  website: string;
  [key: string]: any;
}

interface RestaurantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  onSearch: () => void;
  searching: boolean;
  searchResults: Restaurant[];
  searchError: string;
}

export default function RestaurantSearchModal({
  isOpen,
  onClose,
  onSelectRestaurant,
  searchQuery,
  setSearchQuery,
  searchLocation,
  setSearchLocation,
  onSearch,
  searching,
  searchResults,
  searchError
}: RestaurantSearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Search Restaurant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Search for a restaurant to auto-populate the form with verified data from Google Maps.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter restaurant name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Manhattan, NY, USA"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  />
                </div>
              </div>

              <button
                onClick={onSearch}
                disabled={searching || !searchQuery.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                {searching ? 'Searching...' : 'Search Restaurants'}
              </button>
            </div>
          </div>

          {searchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({searchResults.length})
              </h3>
              <div className="space-y-4">
                {searchResults.map((restaurant, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => {
                      onSelectRestaurant(restaurant);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{restaurant.name}</h4>
                      {restaurant.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current mr-1" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                          {restaurant.reviews && (
                            <span className="text-xs text-gray-500 ml-1">({restaurant.reviews})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {restaurant.address && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{restaurant.address}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{restaurant.website}</span>
                        </div>
                      )}
                      <div className="flex items-center mt-2">
                        {restaurant.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mr-2">
                            {restaurant.category}
                          </span>
                        )}
                        {restaurant.price_range && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {restaurant.price_range}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!searching && searchResults.length === 0 && !searchError && searchQuery && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No restaurants found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

