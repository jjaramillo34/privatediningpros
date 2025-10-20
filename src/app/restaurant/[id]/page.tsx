'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Camera } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import StreetViewImage from '@/components/StreetViewImage';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import RestaurantHero from '@/components/restaurant/RestaurantHero';
import RestaurantSidebar from '@/components/restaurant/RestaurantSidebar';
import PrivateRoomsDisplay from '@/components/restaurant/PrivateRoomsDisplay';
import ReviewsSection from '@/components/restaurant/ReviewsSection';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  full_address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  description?: string;
  short_description?: string;
  additional_features?: string;
  category?: string;
  subtypes?: string;
  price_range?: string;
  rating?: number;
  reviews?: number;
  images?: (string | { url: string; alt?: string; title?: string; source?: string; website?: any; dimensions?: any })[];
  privateRooms?: Array<{
    name: string;
    capacity: number;
    setup?: string;
    description: string;
  }>;
  working_hours?: string | Record<string, string>;
  latitude?: number;
  longitude?: number;
  street_view?: string | { url?: string };
  reservation_links?: string;
  booking_appointment_link?: string;
  menu_link?: string;
  featured?: boolean;
  status?: string;
  verified?: boolean;
  business_status?: string;
  photos_count?: number;
  reviews_per_score?: string;
  reviews_tags?: string;
  logo?: string;
  photo?: string;
  submittedBy?: string;
  approvedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data);
        }
      } catch (error) {
        // Error fetching restaurant
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRestaurant();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <RestaurantHero restaurant={restaurant} />

      {/* Main Content - 70/30 Layout - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main Content Area - 70% (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Description Section */}
            {restaurant.description && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
                  About {restaurant.name}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <MarkdownRenderer content={String(restaurant.description)} />
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {restaurant.images && restaurant.images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Camera className="h-8 w-8 text-blue-600 mr-3" />
                    Photo Gallery
                  </h2>
                  <span className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full font-medium">
                    {Math.min(5, restaurant.images.length)} of {restaurant.images.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {restaurant.images.slice(0, 5).map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const imageAlt = typeof image === 'string' ? `${restaurant.name} - Image ${index + 1}` : image.alt || `${restaurant.name} - Image ${index + 1}`;
                    
                    return (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300">
                        <img 
                          src={imageUrl}
                          alt={imageAlt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-restaurant.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <span className="text-white font-semibold text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Image Credits */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Photo Credits:</p>
                  <div className="space-y-2">
                    {restaurant.images.slice(0, 5).map((image, index) => {
                      const imageData = typeof image === 'string' ? null : image;
                      const websiteUrl = imageData?.website?.url || imageData?.source;
                      const websiteTitle = imageData?.website?.title || imageData?.website?.name || imageData?.title || 'Source';
                      
                      return (
                        <div key={index} className="flex items-start space-x-2 text-xs">
                          <span className="flex-shrink-0 font-medium text-gray-600 min-w-[60px]">
                            Image {index + 1}:
                          </span>
                          {websiteUrl ? (
                            <a 
                              href={websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex-1 break-all"
                            >
                              {websiteTitle}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic flex-1">No source</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Private Rooms Section */}
            {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-200">
                  Private Dining Rooms
                </h2>
                <PrivateRoomsDisplay rooms={restaurant.privateRooms} restaurantName={restaurant.name} />
              </div>
            )}

            {/* Working Hours */}
            {restaurant.working_hours && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-200 flex items-center">
                  <Clock className="h-8 w-8 text-green-600 mr-3" />
                  Operating Hours
                </h2>
                {typeof restaurant.working_hours === 'string' ? (
                  <div className="prose prose-lg max-w-none">
                    <MarkdownRenderer content={restaurant.working_hours} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(restaurant.working_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-gray-100 hover:to-blue-100 transition-colors">
                        <span className="text-lg font-semibold text-gray-900 capitalize">{day}</span>
                        <span className="text-base text-gray-600 font-medium">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Street View */}
            {restaurant.street_view && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-cyan-200">
                  Street View
                </h2>
                <StreetViewImage 
                  streetViewUrl={typeof restaurant.street_view === 'string' ? restaurant.street_view : (restaurant.street_view as any)?.url || String(restaurant.street_view)} 
                  restaurantName={restaurant.name} 
                />
              </div>
            )}

            {/* Map */}
            {restaurant.latitude && restaurant.longitude && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-200">
                  Location
                </h2>
                <div className="rounded-xl overflow-hidden">
                  <RestaurantMap restaurants={[restaurant as any]} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 30% (3 columns) */}
          <div className="lg:col-span-3">
            <RestaurantSidebar restaurant={restaurant} />
          </div>
        </div>
      </div>
    </div>
  );
}
