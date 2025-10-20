'use client';

import { useState, useMemo, useEffect } from 'react';
import { IRestaurant } from '@/lib/restaurant.model';
import RestaurantMap from '@/components/RestaurantMap';
import { Search, Filter, X, MapPin, Star, Building2, Loader2, Phone, Globe, Clock, Users, ChevronLeft, Heart, MoreHorizontal, Bell, SortAsc } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    minRating: '',
    location: '',
    neighborhood: '',
    capacity: '',
    featured: false
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>();
  const [selectedRestaurantDetails, setSelectedRestaurantDetails] = useState<IRestaurant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flyToRestaurant, setFlyToRestaurant] = useState<string | undefined>();

  // Fetch restaurants data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/restaurants?status=approved');
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r._id?.toString() === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurantId);
      setSelectedRestaurantDetails(restaurant);
      setSidebarOpen(true);
      setFlyToRestaurant(restaurantId); // Trigger fly-to
    }
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedRestaurant(undefined);
    setSelectedRestaurantDetails(null);
  };

  // Get unique values for filter options
  const categories = useMemo(() => {
    const cats = restaurants
      .map(r => r.category)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return cats.sort();
  }, [restaurants]);

  const priceRanges = useMemo(() => {
    const ranges = restaurants
      .map(r => r.price_range)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return ranges.sort();
  }, [restaurants]);

  const locations = useMemo(() => {
    const locs = restaurants
      .map(r => `${r.city}, ${r.state}`)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return locs.sort();
  }, [restaurants]);

  const neighborhoods = useMemo(() => {
    const hoods = restaurants
      .map(r => r.neighborhood)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return hoods.sort();
  }, [restaurants]);

  const capacityRanges = [
    { label: 'Small (2-10)', value: 'small' },
    { label: 'Medium (11-25)', value: 'medium' },
    { label: 'Large (26-50)', value: 'large' },
    { label: 'Extra Large (50+)', value: 'xl' }
  ];

  // Filter restaurants based on current filters
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          restaurant.name.toLowerCase().includes(searchLower) ||
          restaurant.description?.toLowerCase().includes(searchLower) ||
          restaurant.short_description?.toLowerCase().includes(searchLower) ||
          restaurant.category?.toLowerCase().includes(searchLower) ||
          restaurant.city?.toLowerCase().includes(searchLower) ||
          restaurant.state?.toLowerCase().includes(searchLower) ||
          restaurant.neighborhood?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && restaurant.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange && restaurant.price_range !== filters.priceRange) {
        return false;
      }

      // Rating filter
      if (filters.minRating && restaurant.rating) {
        if (restaurant.rating < parseFloat(filters.minRating)) {
          return false;
        }
      }

      // Featured filter
      if (filters.featured && !restaurant.featured) {
        return false;
      }

      // Location filter
      if (filters.location) {
        const restaurantLocation = `${restaurant.city}, ${restaurant.state}`;
        if (restaurantLocation !== filters.location) {
          return false;
        }
      }

      // Neighborhood filter
      if (filters.neighborhood && restaurant.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Capacity filter
      if (filters.capacity && restaurant.privateRooms) {
        const maxCapacity = Math.max(...restaurant.privateRooms.map(room => room.capacity || 0));
        let hasCapacity = false;
        
        switch (filters.capacity) {
          case 'small':
            hasCapacity = maxCapacity <= 10;
            break;
          case 'medium':
            hasCapacity = maxCapacity > 10 && maxCapacity <= 25;
            break;
          case 'large':
            hasCapacity = maxCapacity > 25 && maxCapacity <= 50;
            break;
          case 'xl':
            hasCapacity = maxCapacity > 50;
            break;
        }
        
        if (!hasCapacity) return false;
      }

      return true;
    });
  }, [restaurants, filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: '',
      minRating: '',
      location: '',
      neighborhood: '',
      capacity: '',
      featured: false
    });
    setSelectedRestaurant(undefined);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Map</h2>
          <p className="text-gray-600">Fetching restaurant data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Restaurant Details Component
  const RestaurantDetails = ({ restaurant }: { restaurant: IRestaurant }) => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Restaurant Details</h2>
        <button
          onClick={closeSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Restaurant Image */}
        <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={restaurant.image || '/hero-restaurant.jpg'}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          {restaurant.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
            <span className="text-sm">
              {restaurant.neighborhood && `${restaurant.neighborhood}, `}
              {restaurant.city}, {restaurant.state}
            </span>
          </div>
          {restaurant.rating && (
            <div className="flex items-center text-gray-600 mb-3">
              <Star className="h-4 w-4 mr-1.5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{restaurant.rating}/5</span>
            </div>
          )}
        </div>

        {/* Description */}
        {restaurant.short_description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {restaurant.short_description}
            </p>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Contact Information</h4>
          
          {restaurant.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-3 text-blue-500" />
              <a 
                href={`tel:${restaurant.phone}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {restaurant.phone}
              </a>
            </div>
          )}

          {restaurant.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-3 text-blue-500" />
              <a 
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Visit Website
              </a>
            </div>
          )}

          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-3 text-blue-500 mt-0.5" />
            <div className="text-gray-600 text-sm">
              <div>{restaurant.address}</div>
              {restaurant.city && restaurant.state && (
                <div>{restaurant.city}, {restaurant.state} {restaurant.postal_code}</div>
              )}
            </div>
          </div>
        </div>

        {/* Private Rooms */}
        {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Private Dining Rooms</h4>
            <div className="space-y-3">
              {restaurant.privateRooms.map((room, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{room.name}</h5>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{room.capacity} people</span>
                    </div>
                  </div>
                  {room.description && (
                    <p className="text-gray-600 text-sm">{room.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-4 border-t border-gray-200">
          <Link
            href={`/restaurant/${restaurant._id?.toString() || ''}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="font-medium">Back</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <option value="">💰 PRICE</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </select>
            <select 
              value={filters.capacity}
              onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <option value="">👥 CAPACITY</option>
              <option value="small">Small (2-10)</option>
              <option value="medium">Medium (11-25)</option>
              <option value="large">Large (26-50)</option>
              <option value="xl">XL (50+)</option>
            </select>
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <option value="">⭐ AMENITIES</option>
              <option value="Private Rooms">Private Rooms</option>
              <option value="Wine Cellar">Wine Cellar</option>
              <option value="Outdoor Space">Outdoor Space</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              <Bell className="h-4 w-4 mr-2" />
              SAVE SEARCH
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            {filteredRestaurants.length} Private Dining Restaurants in New York - Updated Daily
          </h1>
          <div className="flex items-center mt-3">
            <span className="text-sm font-semibold text-gray-700 mr-4">SORT BY:</span>
            <select className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm hover:shadow-md transition-all">
              <option>DEFAULT</option>
              <option>PRICE LOW TO HIGH</option>
              <option>PRICE HIGH TO LOW</option>
              <option>RATING</option>
              <option>DISTANCE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Restaurant Listings */}
        <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Looking for Private Dining?</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Our curated selection offers the finest private dining experiences in NYC. 
                  Each venue features exclusive private rooms perfect for special occasions.
                </p>
                <button className="mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/30">
                  LEARN MORE
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">💰</span>
              </div>
              <p className="text-sm font-medium">
                Prices shown are base rates only and don't include service charges, taxes, or gratuity. 
                Contact each restaurant for complete pricing details.
              </p>
            </div>
          </div>

          {/* Restaurant Listings */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">FEATURED</h2>
              <span className="text-sm text-gray-500">{filteredRestaurants.length} restaurants</span>
            </div>

            {filteredRestaurants.slice(0, 10).map((restaurant, index) => (
              <div
                key={restaurant._id?.toString() || `restaurant-${index}`}
                className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                onClick={() => handleRestaurantSelect(restaurant._id?.toString() || '')}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={restaurant.image || '/hero-restaurant.jpg'}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {restaurant.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      ⭐ FEATURED
                    </div>
                  )}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg hover:shadow-xl">
                    <Heart className="h-4 w-4 text-red-500 hover:text-red-600" />
                  </button>
                </div>

                {/* Restaurant Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                    PRIVATE DINING AT {restaurant.name.toUpperCase()}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                    {restaurant.address}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center mb-3">
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {restaurant.price_range || '$$$'} 
                    </span>
                    <span className="text-sm text-gray-500 ml-2">per person</span>
                    <button className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Rating */}
                  {restaurant.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900 ml-1">
                          {restaurant.rating}/5
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({restaurant.reviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* Private Rooms Info */}
                  {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600 mb-3 bg-blue-50 px-3 py-2 rounded-lg">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">
                        {restaurant.privateRooms.length} private room{restaurant.privateRooms.length > 1 ? 's' : ''} • 
                        Up to {Math.max(...restaurant.privateRooms.map(room => room.capacity || 0))} guests
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  {restaurant.category && (
                    <div className="text-sm text-gray-600 mb-3 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                      <span className="font-medium text-purple-700">{restaurant.category}</span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500 text-xs">
                      Listed by {restaurant.submittedBy || 'Private Dining Pros'}
                    </span>
                    <div className="flex items-center space-x-2">
                      {restaurant.phone && (
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Phone className="h-4 w-4" />
                        </button>
                      )}
                      {restaurant.website && (
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Globe className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-3/4 h-full">
          <RestaurantMap 
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onRestaurantSelect={handleRestaurantSelect}
            flyToRestaurant={flyToRestaurant}
          />
        </div>
      </div>
    </div>
  );
}
