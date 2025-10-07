'use client';

import { useState, useMemo, useEffect } from 'react';
import { IRestaurant } from '@/lib/restaurant.model';
import RestaurantMap from '@/components/RestaurantMap';
import { Search, Filter, X, MapPin, Star, Building2, Loader2, Phone, Globe, Clock, Users, ChevronLeft } from 'lucide-react';
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

  // Fetch restaurants data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/restaurants');
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
            href={`/restaurant/${restaurant._id}`}
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Link href="/" className="flex items-center text-blue-200 hover:text-white transition-colors">
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 flex items-center justify-center animate-fade-in">
              <MapPin className="h-12 w-12 lg:h-16 lg:w-16 mr-4 text-blue-300 animate-pulse" />
              Restaurant Map
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
              Discover the finest private dining experiences across New York City. 
              Click on any restaurant to explore their exclusive venues and private rooms.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <Building2 className="h-5 w-5 mr-2 text-blue-300" />
                <span className="text-lg font-semibold">
                  {filteredRestaurants.length} Restaurants
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                <Filter className="h-5 w-5 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>

              {/* Neighborhood */}
              <select
                value={filters.neighborhood}
                onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Neighborhoods</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Active filters applied
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)] lg:h-[calc(100vh-220px)]">
        {/* Map Area */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="h-full">
            <RestaurantMap 
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onRestaurantSelect={handleRestaurantSelect}
            />
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && selectedRestaurantDetails && (
          <div className="w-full lg:w-1/3 bg-white border-l border-gray-200 shadow-lg">
            <RestaurantDetails restaurant={selectedRestaurantDetails} />
          </div>
        )}
      </div>
    </div>
  );
}
