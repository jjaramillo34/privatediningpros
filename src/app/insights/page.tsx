'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Building2, 
  Star, 
  DollarSign, 
  Users, 
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Heart,
  Crown,
  TrendingDown,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Restaurant {
  _id: string;
  name: string;
  neighborhood?: string;
  city?: string;
  category?: string;
  rating?: number;
  price_range?: string;
  privateRooms?: Array<{ capacity: number }>;
  featured?: boolean;
  status: string;
}

export default function InsightsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'neighborhoods' | 'categories' | 'pricing'>('overview');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.filter((r: Restaurant) => r.status === 'approved'));
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analytics calculations
  const totalRestaurants = restaurants.length;
  const totalPrivateRooms = restaurants.reduce((sum, r) => sum + (r.privateRooms?.length || 0), 0);
  const totalCapacity = restaurants.reduce((sum, r) => {
    const roomCapacities = r.privateRooms?.map(room => room.capacity || 0) || [];
    return sum + roomCapacities.reduce((acc, cap) => acc + cap, 0);
  }, 0);
  const avgRating = restaurants.length > 0 
    ? (restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.filter(r => r.rating).length).toFixed(2)
    : '0.00';
  const featuredCount = restaurants.filter(r => r.featured).length;

  // Neighborhood analysis
  const neighborhoodData = restaurants.reduce((acc, r) => {
    const hood = r.neighborhood || 'Unknown';
    if (!acc[hood]) {
      acc[hood] = { count: 0, totalRooms: 0, avgRating: 0, ratingCount: 0 };
    }
    acc[hood].count += 1;
    acc[hood].totalRooms += r.privateRooms?.length || 0;
    if (r.rating) {
      acc[hood].avgRating += r.rating;
      acc[hood].ratingCount += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; totalRooms: number; avgRating: number; ratingCount: number }>);

  const topNeighborhoods = Object.entries(neighborhoodData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalRooms: data.totalRooms,
      avgRating: data.ratingCount > 0 ? (data.avgRating / data.ratingCount).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Category analysis
  const categoryData = restaurants.reduce((acc, r) => {
    const cat = r.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalRooms: 0, avgRating: 0, ratingCount: 0 };
    }
    acc[cat].count += 1;
    acc[cat].totalRooms += r.privateRooms?.length || 0;
    if (r.rating) {
      acc[cat].avgRating += r.rating;
      acc[cat].ratingCount += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; totalRooms: number; avgRating: number; ratingCount: number }>);

  const topCategories = Object.entries(categoryData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalRooms: data.totalRooms,
      avgRating: data.ratingCount > 0 ? (data.avgRating / data.ratingCount).toFixed(1) : '0.0',
      percentage: ((data.count / totalRestaurants) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  // Price range analysis
  const priceData = restaurants.reduce((acc, r) => {
    const price = r.price_range || 'Unknown';
    if (!acc[price]) {
      acc[price] = { count: 0, avgRooms: 0 };
    }
    acc[price].count += 1;
    acc[price].avgRooms += r.privateRooms?.length || 0;
    return acc;
  }, {} as Record<string, { count: number; avgRooms: number }>);

  const priceDistribution = Object.entries(priceData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgRooms: (data.avgRooms / data.count).toFixed(1),
      percentage: ((data.count / totalRestaurants) * 100).toFixed(1)
    }))
    .sort((a, b) => {
      const priceOrder: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
      return (priceOrder[a.name] || 999) - (priceOrder[b.name] || 999);
    });

  // Top rated restaurants
  const topRated = [...restaurants]
    .filter(r => r.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Capacity insights
  const maxCapacity = Math.max(...restaurants.map(r => 
    Math.max(...(r.privateRooms?.map(room => room.capacity || 0) || [0]))
  ));
  const avgCapacity = totalCapacity > 0 && totalPrivateRooms > 0
    ? Math.round(totalCapacity / totalPrivateRooms)
    : 0;

  // Rating distribution
  const ratingDistribution = [
    { range: '4.5 - 5.0', min: 4.5, max: 5.0, count: restaurants.filter(r => r.rating && r.rating >= 4.5 && r.rating <= 5.0).length, color: 'from-green-500 to-emerald-600' },
    { range: '4.0 - 4.4', min: 4.0, max: 4.4, count: restaurants.filter(r => r.rating && r.rating >= 4.0 && r.rating < 4.5).length, color: 'from-blue-500 to-blue-600' },
    { range: '3.5 - 3.9', min: 3.5, max: 3.9, count: restaurants.filter(r => r.rating && r.rating >= 3.5 && r.rating < 4.0).length, color: 'from-yellow-500 to-yellow-600' },
    { range: '3.0 - 3.4', min: 3.0, max: 3.4, count: restaurants.filter(r => r.rating && r.rating >= 3.0 && r.rating < 3.5).length, color: 'from-orange-500 to-orange-600' },
    { range: 'Below 3.0', min: 0, max: 2.9, count: restaurants.filter(r => r.rating && r.rating < 3.0).length, color: 'from-red-500 to-red-600' },
  ];

  // Room capacity distribution
  const capacityDistribution = [
    { range: '2-10', min: 2, max: 10, count: 0, color: 'bg-blue-500' },
    { range: '11-25', min: 11, max: 25, count: 0, color: 'bg-green-500' },
    { range: '26-50', min: 26, max: 50, count: 0, color: 'bg-yellow-500' },
    { range: '51-100', min: 51, max: 100, count: 0, color: 'bg-orange-500' },
    { range: '100+', min: 100, max: 9999, count: 0, color: 'bg-red-500' },
  ];

  restaurants.forEach(r => {
    r.privateRooms?.forEach(room => {
      const cap = room.capacity || 0;
      capacityDistribution.forEach(dist => {
        if (cap >= dist.min && cap <= dist.max) {
          dist.count++;
        }
      });
    });
  });

  // Neighborhoods with most rooms
  const neighborhoodsByRooms = Object.entries(neighborhoodData)
    .map(([name, data]) => ({ name, totalRooms: data.totalRooms }))
    .sort((a, b) => b.totalRooms - a.totalRooms)
    .slice(0, 5);

  // Compare categories
  const toggleCategoryCompare = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category].slice(0, 3) // Max 3 categories
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90 mb-6">
              <Activity className="h-4 w-4 mr-2" />
              Data-Driven Insights
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Market Insights
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover trends, patterns, and deep analytics across NYC's private dining landscape
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-300" />
                <span>{totalRestaurants} Venues Analyzed</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Users className="h-5 w-5 text-green-300" />
                <span>{totalCapacity.toLocaleString()} Total Capacity</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>{avgRating} Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin },
              { id: 'categories', label: 'Categories', icon: Filter },
              { id: 'pricing', label: 'Pricing', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="h-8 w-8" />
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{totalRestaurants}</div>
                <div className="text-blue-100 text-sm">Total Venues</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8" />
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{totalPrivateRooms}</div>
                <div className="text-green-100 text-sm">Private Rooms</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Star className="h-8 w-8" />
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{avgRating}</div>
                <div className="text-yellow-100 text-sm">Average Rating</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8" />
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{totalCapacity.toLocaleString()}</div>
                <div className="text-purple-100 text-sm">Total Capacity</div>
              </div>
            </div>

            {/* Top Rated Restaurants */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                  Top Rated Restaurants
                </h2>
                <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {topRated.map((restaurant, index) => (
                  <Link
                    key={restaurant._id}
                    href={`/restaurant/${restaurant._id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {restaurant.neighborhood && `${restaurant.neighborhood} • `}
                          {restaurant.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-gray-900">{restaurant.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rating Distribution Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                Rating Distribution
              </h2>
              <div className="space-y-4">
                {ratingDistribution.map((dist) => {
                  const maxCount = Math.max(...ratingDistribution.map(d => d.count));
                  const percentage = maxCount > 0 ? (dist.count / maxCount) * 100 : 0;
                  const totalPercentage = restaurants.length > 0 ? ((dist.count / restaurants.length) * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={dist.range} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${dist.color}`}></div>
                          <span className="font-medium text-gray-900">{dist.range}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{totalPercentage}%</span>
                          <span className="text-lg font-bold text-gray-900">{dist.count}</span>
                        </div>
                      </div>
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden group">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${dist.color} rounded-lg transition-all duration-700 ease-out group-hover:opacity-90`}
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-sm font-medium text-gray-700">{dist.count} restaurants</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capacity Distribution Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-green-600 mr-2" />
                Room Capacity Distribution
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {capacityDistribution.map((dist) => {
                  const maxCount = Math.max(...capacityDistribution.map(d => d.count));
                  const heightPercentage = maxCount > 0 ? (dist.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={dist.range} className="text-center">
                      <div className="relative h-48 bg-gray-100 rounded-lg mb-3 flex items-end justify-center p-2">
                        <div 
                          className={`${dist.color} rounded-t-lg w-full transition-all duration-700 ease-out flex items-end justify-center pb-2`}
                          style={{ height: `${heightPercentage}%`, minHeight: dist.count > 0 ? '20%' : '0%' }}
                        >
                          <span className="text-white font-bold text-lg">{dist.count}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">{dist.range}</div>
                      <div className="text-xs text-gray-600">guests</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center text-sm text-gray-600">
                Total of {totalPrivateRooms} private rooms analyzed
              </div>
            </div>

            {/* Capacity Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{avgCapacity}</div>
                <div className="text-gray-600 text-sm">Average Room Capacity</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{maxCapacity}</div>
                <div className="text-gray-600 text-sm">Largest Room Capacity</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{featuredCount}</div>
                <div className="text-gray-600 text-sm">Featured Venues</div>
              </div>
            </div>

            {/* Neighborhoods with Most Rooms - Visual Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-purple-600 mr-2" />
                Neighborhoods by Private Room Count
              </h2>
              <div className="space-y-4">
                {neighborhoodsByRooms.map((neighborhood, index) => {
                  const maxRooms = neighborhoodsByRooms[0].totalRooms;
                  const percentage = (neighborhood.totalRooms / maxRooms) * 100;
                  
                  return (
                    <div key={neighborhood.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{neighborhood.name}</span>
                        <span className="text-2xl font-bold text-purple-600">{neighborhood.totalRooms}</span>
                      </div>
                      <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-700 ease-out flex items-center px-4"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white font-semibold text-sm">
                            {neighborhood.totalRooms} rooms
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Neighborhoods Tab */}
        {activeTab === 'neighborhoods' && (
          <div className="space-y-8">
            {/* Interactive Neighborhood Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topNeighborhoods.map((neighborhood, index) => {
                const isSelected = selectedNeighborhood === neighborhood.name;
                const colors = [
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600',
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600',
                  'from-indigo-500 to-indigo-600',
                  'from-teal-500 to-teal-600',
                  'from-yellow-500 to-yellow-600',
                  'from-red-500 to-red-600',
                  'from-cyan-500 to-cyan-600',
                ];
                const color = colors[index % colors.length];
                
                return (
                  <button
                    key={neighborhood.name}
                    onClick={() => setSelectedNeighborhood(isSelected ? null : neighborhood.name)}
                    className={`text-left bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                      isSelected ? 'ring-4 ring-white scale-105' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        #{index + 1}
                      </div>
                      {isSelected && (
                        <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                          Selected
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{neighborhood.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Restaurants:</span>
                        <span className="text-2xl font-bold">{neighborhood.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Private Rooms:</span>
                        <span className="text-xl font-bold">{neighborhood.totalRooms}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Avg Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-xl font-bold">{neighborhood.avgRating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span>Market Share</span>
                        <span className="font-bold">
                          {((neighborhood.count / totalRestaurants) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Neighborhood Comparison Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                Restaurant Count by Neighborhood
              </h2>
              <div className="space-y-3">
                {topNeighborhoods.map((neighborhood, index) => {
                  const maxCount = topNeighborhoods[0].count;
                  const percentage = (neighborhood.count / maxCount) * 100;
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-green-500 to-green-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-pink-500 to-pink-600',
                    'from-indigo-500 to-indigo-600',
                    'from-teal-500 to-teal-600',
                    'from-yellow-500 to-yellow-600',
                    'from-red-500 to-red-600',
                    'from-cyan-500 to-cyan-600',
                  ];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={neighborhood.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{neighborhood.name}</h3>
                            <p className="text-xs text-gray-600">
                              {neighborhood.totalRooms} rooms • ⭐ {neighborhood.avgRating}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{neighborhood.count}</div>
                          <div className="text-xs text-gray-600">restaurants</div>
                        </div>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Category Comparison Tool */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Filter className="h-6 w-6 text-blue-600 mr-2" />
                  Compare Categories
                </h2>
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    compareMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {compareMode ? 'Exit Compare' : 'Enable Compare'}
                </button>
              </div>
              {compareMode && (
                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Select up to 3 categories to compare (click cards below)
                  </p>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(cat => (
                        <div key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                          <span>{cat}</span>
                          <button onClick={() => toggleCategoryCompare(cat)}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCategories.map((category, index) => {
                const isSelected = selectedCategories.includes(category.name);
                const colors = [
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600',
                  'from-purple-500 to-purple-600',
                  'from-yellow-500 to-orange-500',
                  'from-pink-500 to-rose-500',
                  'from-indigo-500 to-indigo-600',
                  'from-teal-500 to-teal-600',
                  'from-red-500 to-red-600',
                  'from-cyan-500 to-cyan-600',
                  'from-amber-500 to-amber-600',
                ];
                const color = colors[index % colors.length];
                
                return (
                  <button
                    key={category.name}
                    onClick={() => compareMode && toggleCategoryCompare(category.name)}
                    disabled={!compareMode}
                    className={`text-left bg-gradient-to-br ${color} rounded-xl p-6 text-white transition-all duration-300 ${
                      compareMode ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : ''
                    } ${isSelected ? 'ring-4 ring-white scale-105 shadow-2xl' : 'shadow-lg'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                        <p className="text-white/80 text-sm">
                          {category.totalRooms} total rooms
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{category.count}</div>
                        <div className="text-white/80 text-xs">venues</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{category.avgRating}</span>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        {category.percentage}% of total
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold text-center">
                        ✓ Selected for Comparison
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Comparison Chart */}
            {selectedCategories.length >= 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                  Category Comparison
                </h2>
                <div className="space-y-6">
                  {/* Restaurant Count Comparison */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Restaurant Count</h3>
                    <div className="space-y-2">
                      {selectedCategories.map((catName) => {
                        const category = topCategories.find(c => c.name === catName);
                        if (!category) return null;
                        const maxCount = Math.max(...selectedCategories.map(cn => 
                          topCategories.find(c => c.name === cn)?.count || 0
                        ));
                        const percentage = (category.count / maxCount) * 100;
                        
                        return (
                          <div key={catName} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900">{catName}</span>
                              <span className="font-bold text-gray-900">{category.count}</span>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 flex items-center px-3"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-white text-xs font-semibold">{category.count} restaurants</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Average Rating Comparison */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Average Rating</h3>
                    <div className="space-y-2">
                      {selectedCategories.map((catName) => {
                        const category = topCategories.find(c => c.name === catName);
                        if (!category) return null;
                        const rating = parseFloat(category.avgRating);
                        const percentage = (rating / 5) * 100;
                        
                        return (
                          <div key={catName} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900">{catName}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-bold text-gray-900">{category.avgRating}</span>
                              </div>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 flex items-center px-3"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-white text-xs font-semibold">⭐ {category.avgRating} / 5.0</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room Count Comparison */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Total Private Rooms</h3>
                    <div className="space-y-2">
                      {selectedCategories.map((catName) => {
                        const category = topCategories.find(c => c.name === catName);
                        if (!category) return null;
                        const maxRooms = Math.max(...selectedCategories.map(cn => 
                          topCategories.find(c => c.name === cn)?.totalRooms || 0
                        ));
                        const percentage = (category.totalRooms / maxRooms) * 100;
                        
                        return (
                          <div key={catName} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900">{catName}</span>
                              <span className="font-bold text-gray-900">{category.totalRooms} rooms</span>
                            </div>
                            <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 flex items-center px-3"
                                style={{ width: `${percentage}%` }}
                              >
                                <span className="text-white text-xs font-semibold">{category.totalRooms} rooms</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Distribution Pie Chart Visual */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <PieChart className="h-6 w-6 text-purple-600 mr-2" />
                Market Share Distribution
              </h2>
              <div className="space-y-3">
                {topCategories.slice(0, 8).map((category, index) => {
                  const colors = [
                    { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-100' },
                    { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-100' },
                    { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-100' },
                    { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-100' },
                    { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-100' },
                    { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-100' },
                    { bg: 'bg-teal-500', text: 'text-teal-700', light: 'bg-teal-100' },
                    { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-100' },
                  ];
                  const colorSet = colors[index % colors.length];
                  
                  return (
                    <div key={category.name} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 ${colorSet.bg} rounded`}></div>
                            <span className="font-semibold text-gray-900">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">{category.count} venues</span>
                            <span className={`px-3 py-1 ${colorSet.light} ${colorSet.text} rounded-full text-sm font-bold`}>
                              {category.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colorSet.bg} transition-all duration-700 ease-out`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            {/* Price Range Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {priceDistribution.map((price, index) => {
                const gradients = [
                  'from-emerald-400 to-emerald-600',
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-orange-400 to-orange-600',
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <div key={price.name} className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold mb-2">{price.name}</div>
                      <div className="text-white/80 text-sm">Price Range</div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Restaurants:</span>
                        <span className="text-2xl font-bold">{price.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Avg Rooms:</span>
                        <span className="text-xl font-bold">{price.avgRooms}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span>Market Share</span>
                        <span className="font-bold text-lg">{price.percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Distribution Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                Restaurant Distribution by Price
              </h2>
              <div className="space-y-4">
                {priceDistribution.map((price, index) => {
                  const maxCount = Math.max(...priceDistribution.map(p => p.count));
                  const percentage = maxCount > 0 ? (price.count / maxCount) * 100 : 0;
                  const colors = [
                    'from-emerald-500 to-emerald-600',
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-red-600',
                  ];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={price.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl font-bold text-green-600">{price.name}</div>
                          <span className="text-sm text-gray-600">{price.name === '$' ? 'Budget' : price.name === '$$' ? 'Moderate' : price.name === '$$$' ? 'Upscale' : 'Luxury'}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{price.percentage}%</span>
                          <span className="text-2xl font-bold text-gray-900">{price.count}</span>
                        </div>
                      </div>
                      <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden group">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-lg transition-all duration-700 ease-out group-hover:opacity-90 flex items-center px-4`}
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white font-semibold text-sm">
                            {price.count} restaurants ({price.avgRooms} avg rooms)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price vs Quality Matrix */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 text-purple-600 mr-2" />
                Price vs Quality Matrix
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price Range</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Count</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg Rating</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg Rooms</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Market Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceDistribution.map((price, index) => {
                      const priceRestaurants = restaurants.filter(r => r.price_range === price.name);
                      const avgRating = priceRestaurants.length > 0
                        ? (priceRestaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / priceRestaurants.filter(r => r.rating).length).toFixed(1)
                        : '0.0';
                      
                      return (
                        <tr key={price.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="text-2xl font-bold text-green-600">{price.name}</div>
                              <span className="text-sm text-gray-600">
                                {price.name === '$' ? 'Budget' : price.name === '$$' ? 'Moderate' : price.name === '$$$' ? 'Upscale' : 'Luxury'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-lg font-bold text-gray-900">{price.count}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-bold text-gray-900">{avgRating}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="font-bold text-gray-900">{price.avgRooms}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-full bg-green-500"
                                  style={{ width: `${price.percentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-semibold text-gray-700">{price.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

