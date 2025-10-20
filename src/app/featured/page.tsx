'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, Users, Building2, Search, Filter, X, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
  description?: string;
}

interface RestaurantImage {
  url: string;
  alt?: string;
  title?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  description?: string;
  short_description?: string;
  image?: string;
  images?: RestaurantImage[];
  rating?: number;
  category?: string;
  price_range?: string;
  website?: string;
  phone?: string;
  privateRooms: PrivateRoom[];
  featured?: boolean;
}

export default function FeaturedPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = useState({
    search: '',
    neighborhood: '',
    category: '',
    minCapacity: '',
    maxCapacity: '',
    priceRange: '',
    minRooms: ''
  });

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, restaurants]);

  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants?featured=true');
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      }
    } catch (error) {
      console.error('Error fetching featured restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.description?.toLowerCase().includes(searchLower) ||
        r.neighborhood?.toLowerCase().includes(searchLower)
      );
    }

    // Neighborhood filter
    if (filters.neighborhood) {
      filtered = filtered.filter(r => r.neighborhood === filters.neighborhood);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(r => r.price_range === filters.priceRange);
    }

    // Minimum capacity filter
    if (filters.minCapacity) {
      const minCap = parseInt(filters.minCapacity);
      filtered = filtered.filter(r => 
        r.privateRooms.some(room => room.capacity >= minCap)
      );
    }

    // Maximum capacity filter
    if (filters.maxCapacity) {
      const maxCap = parseInt(filters.maxCapacity);
      filtered = filtered.filter(r => 
        r.privateRooms.some(room => room.capacity <= maxCap)
      );
    }

    // Minimum number of rooms filter
    if (filters.minRooms) {
      const minRooms = parseInt(filters.minRooms);
      filtered = filtered.filter(r => r.privateRooms.length >= minRooms);
    }

    // Sort by name (A-Z)
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      neighborhood: '',
      category: '',
      minCapacity: '',
      maxCapacity: '',
      priceRange: '',
      minRooms: ''
    });
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const getUniqueValues = (key: 'neighborhood' | 'category' | 'price_range') => {
    const values = restaurants
      .map(r => key === 'price_range' ? r.price_range : key === 'category' ? r.category : r.neighborhood)
      .filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const getMaxRoomCapacity = (restaurant: Restaurant) => {
    if (!restaurant.privateRooms || restaurant.privateRooms.length === 0) return 0;
    return Math.max(...restaurant.privateRooms.map(room => room.capacity));
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-12 w-12 text-yellow-300 fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Private Dining Venues
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover our hand-picked selection of exceptional restaurants with private dining rooms. 
              Perfect for celebrations, corporate events, and intimate gatherings.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{restaurants.length} Featured Venues</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{restaurants.reduce((sum, r) => sum + r.privateRooms.length, 0)} Private Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, neighborhoods, or cuisine..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood
                  </label>
                  <select
                    value={filters.neighborhood}
                    onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Neighborhoods</option>
                    {getUniqueValues('neighborhood').map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cuisines</option>
                    {getUniqueValues('category').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Prices</option>
                    {getUniqueValues('price_range').map(price => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>

                {/* Min Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    value={filters.minCapacity}
                    onChange={(e) => setFilters(prev => ({ ...prev, minCapacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Max Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={filters.maxCapacity}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxCapacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Min Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min # of Rooms
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    value={filters.minRooms}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRooms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredRestaurants.length)}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredRestaurants.length}</span> featured restaurants
              {totalPages > 1 && (
                <span className="ml-2 text-gray-500">(Page {currentPage} of {totalPages})</span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <p className="text-blue-600">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </p>
            )}
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more results
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                href={`/restaurant/${restaurant._id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {restaurant.image || restaurant.images?.[0]?.url ? (
                    <Image
                      src={restaurant.image || restaurant.images?.[0]?.url || ''}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {/* Featured Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Featured</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </h3>

                  {/* Location */}
                  {restaurant.neighborhood && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{restaurant.neighborhood}</span>
                    </div>
                  )}

                  {/* Category & Price */}
                  <div className="flex items-center space-x-3 mb-3">
                    {restaurant.category && (
                      <span className="text-sm text-gray-600">{restaurant.category}</span>
                    )}
                    {restaurant.price_range && (
                      <span className="text-sm font-medium text-gray-900">{restaurant.price_range}</span>
                    )}
                  </div>

                  {/* Short Description */}
                  {restaurant.short_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {restaurant.short_description}
                    </p>
                  )}

                  {/* Private Rooms Info */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-700">
                        <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {restaurant.privateRooms.length} Private Room{restaurant.privateRooms.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {getMaxRoomCapacity(restaurant) > 0 && (
                        <div className="flex items-center text-gray-700">
                          <Users className="h-4 w-4 mr-1 text-green-500" />
                          <span>Up to {getMaxRoomCapacity(restaurant)}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    {restaurant.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">{restaurant.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

