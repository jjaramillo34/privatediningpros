import { notFound } from 'next/navigation';
import { DoorOpen, MapPin, Star, Phone, Globe, DollarSign, Users, ArrowLeft, Utensils, Building2, CalendarDays, CalendarCheck, CalendarClock, CheckCircle, Clock, Camera, ExternalLink, Menu, BookOpen } from 'lucide-react';
import { IRestaurant } from '@/lib/restaurant.model';
import Link from 'next/link';
import Image from 'next/image';
import RestaurantImage from '@/components/RestaurantImage';
import RestaurantImageGallery from '@/components/RestaurantImageGallery';
import StreetViewImage from '@/components/StreetViewImage';
import AdditionalRestaurantInfo from '@/components/AdditionalRestaurantInfo';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import React from 'react';

async function getRestaurant(id: string): Promise<IRestaurant | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/restaurants/${id}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

// Helper function to format working hours
function formatWorkingHours(hours: unknown): React.ReactElement[] {
  let hoursObj: Record<string, string> | null = null;
  
  // Handle string input (might be JSON string)
  if (typeof hours === 'string') {
    try {
      // Try to parse as JSON
      hoursObj = JSON.parse(hours);
    } catch {
      // If not JSON, treat as plain text
      return [<span key="hours-string" className="text-gray-600">{hours}</span>];
    }
  }
  
  // Handle object input
  if (typeof hours === 'object' && hours !== null) {
    hoursObj = hours as Record<string, string>;
  }
  
  // If we have a valid hours object, format it
  if (hoursObj) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Format the hours object
    
    return days.map(day => {
      // Try multiple key formats to find the hours
      const dayHours = hoursObj![day.toLowerCase()] || 
                      hoursObj![day] || 
                      hoursObj![day.toUpperCase()] ||
                      hoursObj![day.substring(0, 3).toLowerCase()] ||
                      hoursObj![day.substring(0, 3)];
      
      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
      
      return (
        <div key={day} className={`flex justify-between items-center py-2 px-3 rounded-lg ${isToday ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
          <span className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-700'}`}>
            {day}
            {isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Today</span>}
          </span>
          <span className={`text-sm ${isToday ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
            {dayHours || 'Closed'}
          </span>
        </div>
      );
    });
  }
  
  return [<span key="no-hours" className="text-gray-500 italic">Hours not available</span>];
}

// Mapbox Map Component
function RestaurantMap({ restaurant }: { restaurant: IRestaurant }) {
  if (!restaurant.latitude || !restaurant.longitude) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Map location not available</p>
      </div>
    );
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!mapboxToken) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Mapbox token not configured</p>
      </div>
    );
  }

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+3b82f6(${restaurant.longitude},${restaurant.latitude})/${restaurant.longitude},${restaurant.latitude},14,0/800x400@2x?access_token=${mapboxToken}`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
        Location
      </h2>
      <div className="relative">
        <Image 
          src={mapUrl} 
          alt={`Map showing location of ${restaurant.name}`}
          className="w-full h-96 object-cover rounded-lg"
          width={1000}
          height={1000}
        />
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm">{restaurant.address}</p>
          {restaurant.city && restaurant.state && (
            <p className="text-gray-600 text-sm">{restaurant.city}, {restaurant.state} {restaurant.postal_code}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Restaurants
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-200 overflow-hidden">
        <RestaurantImage
          src={restaurant.image}
          alt={restaurant.name}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Featured Badge */}
        {restaurant.featured && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-yellow-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 fill-current" />
            <span className="hidden sm:inline">Featured Restaurant</span>
            <span className="sm:hidden">Featured</span>
          </div>
        )}
        
        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="text-white flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight">
                  {restaurant.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 text-sm sm:text-base lg:text-lg xl:text-xl">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-1.5 lg:mr-2" />
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {restaurant.neighborhood && `${restaurant.neighborhood}, `}{restaurant.city}, {restaurant.state}
                    </span>
                  </div>
                  {restaurant.rating && (
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current mr-1 sm:mr-1.5 lg:mr-2" />
                      <span className="font-semibold">{restaurant.rating}/5</span>
                    </div>
                  )}
                  {restaurant.price_range && (
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-1.5 lg:mr-2" />
                      <span>{restaurant.price_range}</span>
                    </div>
                  )}
                  {restaurant.category && (
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                      <Utensils className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-1.5 lg:mr-2" />
                      <span className="hidden sm:inline">{restaurant.category}</span>
                      <span className="sm:hidden truncate max-w-[80px]">{restaurant.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Main Content - Now 4 columns */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            {/* Description */}
            {restaurant.description && (
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">About {restaurant.name}</h2>
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <MarkdownRenderer content={restaurant.description} />
                </div>
              </div>
            )}

            {/* Additional Features */}
            {restaurant.additional_features && (
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <Utensils className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-600 mr-2 sm:mr-3" />
                    Additional Features
                  </h2>
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                </div>
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <MarkdownRenderer content={restaurant.additional_features} />
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {restaurant.images && restaurant.images.length > 0 && (
              <RestaurantImageGallery 
                images={restaurant.images} 
                restaurantName={restaurant.name} 
              />
            )}

            {/* Additional Restaurant Information */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <Building2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600 mr-2 sm:mr-3" />
                  Restaurant Details
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Business Status */}
                {restaurant.business_status && (
                  <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Business Status</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">{restaurant.business_status}</p>
                    </div>
                  </div>
                )}

                {/* Verified Status */}
                {restaurant.verified && (
                  <div className="flex items-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Verification</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">Verified Business</p>
                    </div>
                  </div>
                )}

                {/* Typical Time Spent */}
                {restaurant.typical_time_spent && (
                  <div className="flex items-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Typical Visit Duration</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">{restaurant.typical_time_spent}</p>
                    </div>
                  </div>
                )}

                {/* Photos Count */}
                {restaurant.photos_count && (
                  <div className="flex items-center p-3 sm:p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Available Photos</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">{restaurant.photos_count.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Restaurant Subtypes */}
                {restaurant.subtypes && (
                  <div className="flex items-start p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200 sm:col-span-2 lg:col-span-3">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-full mr-3 sm:mr-4 flex-shrink-0 mt-1">
                      <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Restaurant Types</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {restaurant.subtypes.split(', ').map((subtype, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            {subtype.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Link */}
                {restaurant.menu_link && (
                  <div className="flex items-center p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Menu</p>
                      <a 
                        href={restaurant.menu_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center"
                      >
                        View Menu
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Booking Link */}
                {restaurant.reservation_links && (
                  <div className="flex items-center p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Reservations</p>
                      <a 
                        href={restaurant.reservation_links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors flex items-center"
                      >
                        Book Now
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Working Hours Section */}
            {restaurant.working_hours && (
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-600 mr-2 sm:mr-3" />
                  Working Hours
                </h2>
                <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                  <div className="space-y-1">
                    {formatWorkingHours(restaurant.working_hours)}
                  </div>
                </div>
              </div>
            )}


            {/* Map */}
            <RestaurantMap restaurant={restaurant} />
          </div>

          {/* Sidebar - Now 1 column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Restaurant Subtypes as Tags */}
            {restaurant.subtypes && (
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2 sm:mr-3" />
                  Restaurant Types
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {restaurant.subtypes.split(', ').map((subtype, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm sm:text-base font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300 hover:from-orange-200 hover:to-orange-300 transition-all duration-200 shadow-sm hover:shadow-md">
                      {subtype.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Booking */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                Contact & Booking
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {restaurant.phone && (
                  <div className="flex items-center p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                      <a 
                        href={`tel:${restaurant.phone}`}
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all"
                      >
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                )}
                {restaurant.website && (
                  <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Website</p>
                      <a 
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {restaurant.reservation_links && (
                  <div className="flex items-center p-3 sm:p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-500">Reservations</p>
                      <a 
                        href={restaurant.reservation_links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors break-all flex items-center"
                      >
                        Book Now
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Street View */}
            {restaurant.street_view && (
              <StreetViewImage 
                streetViewUrl={restaurant.street_view} 
                restaurantName={restaurant.name} 
              />
            )}

            {/* Private Dining Rooms */}
            {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <DoorOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3" />
                  Private Dining Rooms
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {restaurant.privateRooms.map((room, index) => (
                    <div key={`room-${index}`} className="group border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {room.name}
                        </h4>
                        <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold self-start">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {room.capacity} guests
                        </div>
                      </div>
                      {room.description && (
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{room.description}</p>
                      )}
                      <div className="mt-3 sm:mt-4 flex items-center text-blue-600 text-xs sm:text-sm font-medium">
                        <CalendarCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Perfect for private events
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2 sm:mr-3" />
                Quick Facts
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {restaurant.rating && (
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600 fill-current" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Rating</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{restaurant.rating}/5</p>
                  </div>
                )}
                {restaurant.price_range && (
                  <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full mx-auto mb-2">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Price Range</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{restaurant.price_range}</p>
                      </div>
                )}
                {restaurant.privateRooms && (
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full mx-auto mb-2">
                      <DoorOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Private Rooms</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{restaurant.privateRooms.length}</p>
                  </div>
                )}
                {restaurant.privateRooms && (
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full mx-auto mb-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Capacity</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {restaurant.privateRooms.reduce((total, room) => total + room.capacity, 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <AdditionalRestaurantInfo restaurant={restaurant} />

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
                  <CalendarClock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Book?</h3>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                Contact the restaurant directly to reserve your private dining experience.
              </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
              {restaurant.phone && (
                <a 
                  href={`tel:${restaurant.phone}`}
                    className="block w-full bg-white text-blue-600 text-center py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    📞 Call to Book
                </a>
              )}
              {restaurant.website && (
                <a 
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="block w-full border-2 border-white text-white text-center py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                    🌐 Visit Website
                </a>
              )}
              </div>
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-blue-100 text-xs sm:text-sm">
                  ✨ Book directly with the restaurant for the best experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 