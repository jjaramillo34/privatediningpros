'use client';

import { useState, useMemo, useEffect } from 'react';
import { Building2, DoorOpen, MapPin, Settings, Star, Phone, Globe, DollarSign, Filter, Search, X, ChevronDown, ChevronUp, Loader2, Sparkles, TrendingUp, Plus, Users, Heart, Clock, Award, Shield, Zap, ArrowRight, CheckCircle, Calendar, MessageCircle, BookOpen, Eye } from 'lucide-react';
import { IRestaurant } from '@/lib/restaurant.model';
import Link from 'next/link';
import Image from 'next/image';
import RestaurantImage from '@/components/RestaurantImage';
import RestaurantMap from '@/components/RestaurantMap';

// Utility function to clean up markdown links and format descriptions
const cleanDescription = (description: string): string => {
  if (!description) return '';
  
  // Remove markdown image links like [![text](url)]
  let cleaned = description.replace(/\[!\[.*?\]\(.*?\)\]/g, '');
  
  // Remove standalone markdown links but keep the text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove extra whitespace and newlines
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

interface HomePageProps {
  restaurants: IRestaurant[];
}

type SortOption = 'name' | 'rating' | 'price' | 'newest' | 'popular';

export default function HomePage({ restaurants }: HomePageProps) {
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

  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Set<string>>(new Set());
  const [showTestimonial, setShowTestimonial] = useState(0);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  // Quick filter options with counts
  const quickFilters = [
    { 
      label: 'Featured', 
      icon: Star, 
      filter: { featured: true }, 
      special: true,
      count: restaurants.filter(r => r.featured).length
    },
    { 
      label: 'Top Rated', 
      icon: Star, 
      filter: { minRating: '4.5' },
      count: restaurants.filter(r => r.rating && r.rating >= 4.5).length
    },
    { 
      label: 'Fine Dining', 
      icon: Sparkles, 
      filter: { category: 'Fine Dining' },
      count: restaurants.filter(r => r.category === 'Fine Dining').length
    },
    { 
      label: 'Business', 
      icon: Building2, 
      filter: { category: 'Business' },
      count: restaurants.filter(r => r.category === 'Business').length
    },
    { 
      label: 'Trending', 
      icon: TrendingUp, 
      filter: { minRating: '4.0' },
      count: restaurants.filter(r => r.rating && r.rating >= 4.0).length
    },
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

  // Sort restaurants
  const sortedRestaurants = useMemo(() => {
    return [...filteredRestaurants].sort((a, b) => {
      // Primary sort based on selected option
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'price':
          const aPrice = a.price_range || '';
          const bPrice = b.price_range || '';
          comparison = aPrice.localeCompare(bPrice);
          break;
        case 'newest':
          comparison = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          break;
        case 'popular':
          comparison = (b.privateRooms?.length || 0) - (a.privateRooms?.length || 0);
          break;
      }
      
      const primarySort = sortOrder === 'asc' ? -comparison : comparison;
      
      // If primary sort values are equal, sort by name (A-Z) as secondary sort
      if (primarySort === 0) {
        return (a.name || '').localeCompare(b.name || '');
      }
      
      return primarySort;
    });
  }, [filteredRestaurants, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRestaurants.length / itemsPerPage);
  const paginatedRestaurants = sortedRestaurants.slice(0, currentPage * itemsPerPage);
  const hasMore = currentPage < totalPages;

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
    setCurrentPage(1);
  };

  const applyQuickFilter = (filter: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...filter }));
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const scrollToRestaurants = () => {
    const element = document.getElementById('restaurants');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Sample testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Planner",
      company: "Elite Events NYC",
      content: "PrivateDiningPros has revolutionized how we find venues for our clients. The detailed room information and direct contact details save us hours of research.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Business Executive",
      company: "TechCorp",
      content: "Perfect for our quarterly business dinners. We found an amazing private room that accommodated our entire team with exceptional service.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Wedding Planner",
      company: "Dream Weddings",
      content: "The platform made it so easy to find intimate venues for our couples' rehearsal dinners. The photos and room details are incredibly helpful.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const toggleFavorite = (restaurantId: string) => {
    setFavoriteRestaurants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantId)) {
        newSet.delete(restaurantId);
      } else {
        newSet.add(restaurantId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Action Button */}
      <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <button
          onClick={scrollToRestaurants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
        >
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-restaurant.jpg"
            alt="Elegant restaurant interior"
            className="w-full h-full object-cover opacity-20"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-green-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-purple-400/10 rounded-full blur-lg animate-pulse delay-1500"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              {restaurants.length}+ Premium Restaurants
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Find Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Private Dining
              </span>{' '}
              Experience
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Discover {restaurants.length} restaurants with exclusive private rooms for your special occasions, 
              business meetings, and unforgettable celebrations
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToRestaurants}
                className="group btn-hero bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center animate-glow"
              >
                <Building2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Browse Restaurants
              </button>
              <Link 
                href="/suggest" 
                className="group btn-hero bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Suggest Restaurant
              </Link>
              <Link 
                href="/admin" 
                className="group btn-hero border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center"
              >
                <Settings className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform" />
                Admin Panel
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-blue-100 animate-float">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-sm font-medium">Curated Selection</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="p-2 bg-white/10 rounded-lg">
                  <DoorOpen className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm font-medium">Private Rooms</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="p-2 bg-white/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-sm font-medium">Verified Locations</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      {restaurants.filter(r => r.featured).length > 0 && (
        <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800 mb-4">
                <Star className="h-4 w-4 mr-2 fill-current" />
                Curated Selection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Restaurants
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Handpicked restaurants with exceptional private dining experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants
                .filter(r => r.featured)
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, 6)
                .map((restaurant) => (
                  <Link 
                    key={restaurant._id?.toString() || restaurant.name} 
                    href={`/restaurant/${restaurant._id}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 border-2 border-yellow-200"
                  >
                    {/* Restaurant Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      <RestaurantImage
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </div>

                      {/* Rating Badge */}
                      {restaurant.rating && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-900">{restaurant.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {restaurant.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                        <span className="text-sm font-medium">
                          {restaurant.neighborhood && `${restaurant.neighborhood}, `}
                          {restaurant.city}, {restaurant.state}
                        </span>
                      </div>

                      {restaurant.short_description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                          {restaurant.short_description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {restaurant.category && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {restaurant.category}
                            </span>
                          )}
                          {restaurant.price_range && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {restaurant.price_range}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-blue-600">
                          <span className="text-sm font-medium">View Details</span>
                          <ChevronUp className="h-4 w-4 ml-1 transform rotate-90" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {restaurants.filter(r => r.featured).length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, featured: true }));
                    scrollToRestaurants();
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Star className="h-5 w-5 mr-2 fill-current" />
                  View All Featured Restaurants
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-800 mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trusted by Thousands
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Trusted Platform for Private Dining
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who have found their perfect private dining experience. 
              Discover curated restaurants with exceptional service and unforgettable moments.
            </p>
          </div>
          
          {/* Primary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {restaurants.length}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Premium Restaurants</div>
              <div className="text-sm text-gray-500 mt-2">Curated selection</div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <DoorOpen className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                {restaurants.reduce((total, restaurant) => total + (restaurant.privateRooms?.length || 0), 0)}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Private Rooms</div>
              <div className="text-sm text-gray-500 mt-2">Exclusive spaces</div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                {restaurants.filter(r => r.rating && r.rating >= 4).length}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Top Rated</div>
              <div className="text-sm text-gray-500 mt-2">4+ stars</div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {restaurants.filter(r => r.rating && r.rating >= 4.5).length}
              </div>
              <div className="text-gray-600 font-semibold text-lg">Premium</div>
              <div className="text-sm text-gray-500 mt-2">4.5+ stars</div>
            </div>
          </div>

          {/* Advanced Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Average Rating */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-white fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Average Rating</h3>
                  <p className="text-indigo-600 text-sm font-medium">Overall quality</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-700 mb-2">
                {restaurants.length > 0 ? 
                  (restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.filter(r => r.rating).length).toFixed(1) 
                  : '0.0'
                }
              </div>
              <div className="flex items-center text-sm text-indigo-600">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span>Out of 5.0 stars</span>
              </div>
            </div>

            {/* Total Capacity */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Total Capacity</h3>
                  <p className="text-emerald-600 text-sm font-medium">Across all rooms</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                {restaurants.reduce((total, restaurant) => {
                  const roomCapacities = restaurant.privateRooms?.map(room => room.capacity || 0) || [];
                  return total + roomCapacities.reduce((sum, cap) => sum + cap, 0);
                }, 0)}
              </div>
              <div className="flex items-center text-sm text-emerald-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Guests can be accommodated</span>
              </div>
            </div>

            {/* Featured Restaurants */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200">
              <div className="flex items-center mb-4">
                <div className="bg-amber-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Featured</h3>
                  <p className="text-amber-600 text-sm font-medium">Curated selection</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-700 mb-2">
                {restaurants.filter(r => r.featured).length}
              </div>
              <div className="flex items-center text-sm text-amber-600">
                <Sparkles className="h-4 w-4 mr-1" />
                <span>Handpicked restaurants</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(
                restaurants.reduce((acc, restaurant) => {
                  const category = restaurant.category || 'Other';
                  acc[category] = (acc[category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([category, count]) => (
                  <div key={category} className="text-center group">
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="text-2xl font-bold text-slate-700 mb-1">{count}</div>
                      <div className="text-sm text-slate-600 font-medium truncate" title={category}>
                        {category}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-800 mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Finding your perfect private dining venue is just three simple steps away
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Search & Filter</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our advanced filters to find restaurants by location, cuisine, price range, and capacity. 
                Browse through our curated collection of premium venues.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Details</h3>
              <p className="text-gray-600 leading-relaxed">
                View detailed information about private rooms, amenities, capacity, and pricing. 
                See photos and read reviews from other customers.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Directly</h3>
              <p className="text-gray-600 leading-relaxed">
                Contact the restaurant directly using the provided phone number or website. 
                Book your private dining experience with confidence.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Calendar className="h-5 w-5 mr-2" />
              Start Your Search Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-sm font-medium text-indigo-800 mb-6">
              <MessageCircle className="h-4 w-4 mr-2" />
              What Our Users Say
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Event Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See why thousands of event planners, business executives, and couples trust PrivateDiningPros for their special occasions.
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 transform ${
                    showTestimonial === index 
                      ? 'scale-105 shadow-2xl border-indigo-200' 
                      : 'scale-100 shadow-lg'
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-indigo-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              ))}
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setShowTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    showTestimonial === index 
                      ? 'bg-indigo-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Filters */}
      <section className="py-12 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Discover Your Perfect Experience</h3>
            <p className="text-gray-600">Quick access to curated collections</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {quickFilters.map((quickFilter, index) => {
              const Icon = quickFilter.icon;
              const isSpecial = (quickFilter as any).special;
              const count = (quickFilter as any).count || 0;
              return (
                <button
                  key={index}
                  onClick={() => applyQuickFilter(quickFilter.filter)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    isSpecial 
                      ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg border border-gray-200'
                  }`}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSpecial ? 'bg-white/20' : 'bg-blue-100'}`}>
                        <Icon className={`h-5 w-5 ${isSpecial ? 'text-white' : 'text-blue-600'} group-hover:rotate-12 transition-transform duration-300`} />
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold text-sm ${isSpecial ? 'text-white' : 'text-gray-900'}`}>
                          {quickFilter.label}
                        </div>
                        <div className={`text-xs ${isSpecial ? 'text-yellow-100' : 'text-gray-500'}`}>
                          {count} restaurants
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${isSpecial ? 'opacity-50' : 'opacity-30'}`}></div>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredRestaurants.length}</span> of <span className="font-semibold text-gray-900">{restaurants.length}</span> restaurants available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mapbox View Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Explore Restaurants on the Map</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover private dining venues across different neighborhoods and see their locations at a glance
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <RestaurantMap 
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onRestaurantSelect={setSelectedRestaurant}
            />
            
            {/* Map Footer Info */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{filteredRestaurants.length} restaurants shown</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{filteredRestaurants.filter(r => r.rating && r.rating >= 4).length} highly rated</span>
                  </div>
                  {filteredRestaurants.filter(r => r.featured).length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{filteredRestaurants.filter(r => r.featured).length} featured</span>
                    </div>
                  )}
                </div>
                <Link
                  href="/map"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  View Full Map →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section id="restaurants" className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Mobile-First Header Layout */}
            <div className="mb-6">
              {/* Title and Toggle Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    Filter & Sort
                  </h2>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                  >
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="ml-1">{showFilters ? 'Hide' : 'Show'} Filters</span>
                  </button>
                </div>
                
                {/* Suggest Restaurant Button - Mobile */}
                <div className="sm:hidden">
                  <Link
                    href="/suggest"
                    className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Suggest Restaurant
                  </Link>
                </div>
              </div>

              {/* Controls Row - Responsive Layout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                {/* Left Side - Clear Filters */}
                <div className="flex items-center">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Filters
                    </button>
                  )}
                </div>
                
                {/* Right Side - Sort Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="sort-select" className="text-sm text-gray-600 whitespace-nowrap">
                      Sort by:
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
                    >
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="newest">Newest</option>
                      <option value="popular">Popularity</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                      title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Suggest Restaurant Button - Desktop */}
                  <div className="hidden sm:block">
                    <Link
                      href="/suggest"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Suggest Restaurant
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters - Mobile Optimized */}
            {showFilters && (
              <div className="space-y-4 mb-6">
                {/* Search - Full Width on Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                {/* Filter Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Category */}
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category-filter"
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label htmlFor="price-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <select
                      id="price-filter"
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Prices</option>
                      {priceRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Min Rating
                    </label>
                    <select
                      id="rating-filter"
                      value={filters.minRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location-filter"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Neighborhood */}
                  <div>
                    <label htmlFor="neighborhood-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Neighborhood
                    </label>
                    <select
                      id="neighborhood-filter"
                      value={filters.neighborhood}
                      onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Neighborhoods</option>
                      {neighborhoods.map(neighborhood => (
                        <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Capacity - Full Width on Mobile */}
                <div>
                  <label htmlFor="capacity-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Private Room Capacity
                  </label>
                  <select
                    id="capacity-filter"
                    value={filters.capacity}
                    onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Capacities</option>
                    {capacityRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Results Count - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-sm text-gray-600">
              <div className="text-center sm:text-left">
                <span className="font-medium text-gray-900">{paginatedRestaurants.length}</span> of <span className="font-medium text-gray-900">{filteredRestaurants.length}</span> restaurants
                {hasActiveFilters && (
                  <span className="block sm:inline sm:ml-1 text-xs text-gray-500">
                    (filtered from {restaurants.length} total)
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <label htmlFor="items-per-page" className="text-sm text-gray-600">
                  Show:
                </label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedRestaurants.map((restaurant) => (
                  <Link 
                    key={restaurant._id?.toString() || restaurant.name} 
                    href={`/restaurant/${restaurant._id}`}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 border-2 ${
                      selectedRestaurant === restaurant._id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-100'
                    }`}
                  >
                    {/* Restaurant Image */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                      <RestaurantImage
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Featured Badge */}
                      {restaurant.featured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(restaurant._id?.toString() || restaurant.name);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 group"
                      >
                        <Heart 
                          className={`h-4 w-4 transition-all duration-300 ${
                            favoriteRestaurants.has(restaurant._id?.toString() || restaurant.name)
                              ? 'text-red-500 fill-current scale-110' 
                              : 'text-gray-400 group-hover:text-red-400'
                          }`} 
                        />
                      </button>

                      {/* Rating Badge */}
                      {restaurant.rating && (
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-900">{restaurant.rating}</span>
                        </div>
                      )}

                      {/* Private Rooms Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center">
                        <DoorOpen className="h-4 w-4 mr-1.5" />
                        {restaurant.privateRooms?.length || 0} Private Rooms
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                          <span className="text-sm font-medium">
                            {restaurant.neighborhood && `${restaurant.neighborhood}, `}
                            {restaurant.city}, {restaurant.state}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {(restaurant.short_description || restaurant.description) && (
                        <div className="mb-4">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {restaurant.short_description || cleanDescription(restaurant.description || '')}
                          </p>
                        </div>
                      )}

                      {/* Restaurant Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {restaurant.category && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium truncate">{restaurant.category}</span>
                          </div>
                        )}
                        
                        {restaurant.price_range && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            <span className="font-medium">{restaurant.price_range}</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      {(restaurant.phone || restaurant.website) && (
                        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
                          {restaurant.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span className="text-xs truncate">{restaurant.phone}</span>
                            </div>
                          )}
                          {restaurant.website && (
                            <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                              <Globe className="h-4 w-4 mr-1.5" />
                              <span className="text-xs font-medium">Website</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Private Rooms Preview */}
                      {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center text-sm text-blue-800 mb-2">
                            <DoorOpen className="h-4 w-4 mr-2" />
                            <span className="font-bold">Private Rooms ({restaurant.privateRooms.length})</span>
                          </div>
                          <div className="space-y-1">
                            {restaurant.privateRooms.slice(0, 2).map((room, index) => (
                              <div key={index} className="text-xs text-blue-700 font-medium">
                                • {room.name} (up to {room.capacity} guests)
                              </div>
                            ))}
                            {restaurant.privateRooms.length > 2 && (
                              <div className="text-xs text-blue-600 font-medium">
                                • +{restaurant.privateRooms.length - 2} more rooms
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Load More Restaurants
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Showing {paginatedRestaurants.length} of {filteredRestaurants.length} restaurants
                  </p>
                </div>
              )}

              {/* End of Results */}
              {!hasMore && filteredRestaurants.length > 0 && (
                <div className="text-center mt-12">
                  <div className="inline-flex items-center px-6 py-3 bg-green-50 text-green-700 rounded-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    You&apos;ve seen all {filteredRestaurants.length} restaurants!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Ready to Get Started?
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Private Dining
              </span>{' '}
              Experience Today
            </h2>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Join thousands of satisfied customers who have found their ideal private dining venues. 
              Start your search now and create unforgettable memories.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToRestaurants}
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Building2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Browse All Restaurants
              </button>
              <Link 
                href="/map" 
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center"
              >
                <MapPin className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                View on Map
              </Link>
              <Link 
                href="/suggest" 
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Suggest Restaurant
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm font-medium">100% Free</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <div className="p-2 bg-white/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Verified Venues</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-sm font-medium">Always Updated</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 