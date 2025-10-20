'use client';

import { Star, MapPin, Phone, Globe, BookOpen, DollarSign, Users, DoorOpen, Clock, Shield, Camera, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface PrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
  description: string;
}

interface RestaurantSidebarProps {
  restaurant: {
    name: string;
    phone?: string;
    website?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    rating?: number;
    reviews?: number;
    price_range?: string;
    category?: string;
    privateRooms?: PrivateRoom[];
    reservation_links?: string;
    booking_appointment_link?: string;
    menu_link?: string;
    verified?: boolean;
    business_status?: string;
    photos_count?: number;
    reviews_per_score?: string;
    reviews_tags?: string;
    additional_features?: string;
  };
}

export default function RestaurantSidebar({ restaurant }: RestaurantSidebarProps) {
  const totalCapacity = restaurant.privateRooms?.reduce((sum, room) => sum + room.capacity, 0) || 0;
  const maxCapacity = restaurant.privateRooms ? Math.max(...restaurant.privateRooms.map(room => room.capacity)) : 0;

  return (
    <div className="sticky top-24 space-y-6">
      {/* Quick Stats Card */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Quick Overview</h3>
          <p className="text-blue-100 text-sm">Key information at a glance</p>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Rating */}
          {restaurant.rating && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <Star className="h-5 w-5 text-yellow-600 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Rating</p>
                  <p className="text-lg font-bold text-gray-900">{restaurant.rating}/5.0</p>
                </div>
              </div>
              {restaurant.reviews && (
                <p className="text-sm text-gray-600">{restaurant.reviews.toLocaleString()} reviews</p>
              )}
            </div>
          )}

          {/* Price Range */}
          {restaurant.price_range && (
            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Price Range</p>
                <p className="text-lg font-bold text-gray-900">{restaurant.price_range}</p>
              </div>
            </div>
          )}

          {/* Private Rooms */}
          {restaurant.privateRooms && restaurant.privateRooms.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <DoorOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Private Rooms</p>
                  <p className="text-lg font-bold text-gray-900">{restaurant.privateRooms.length} Rooms</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Max Capacity</p>
                  <p className="text-xl font-bold text-blue-600">{maxCapacity}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Total Capacity</p>
                  <p className="text-xl font-bold text-blue-600">{totalCapacity}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category */}
          {restaurant.category && (
            <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{restaurant.category}</p>
              </div>
            </div>
          )}

          {/* Verification Badges */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {restaurant.verified && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </span>
            )}
            {restaurant.business_status === 'OPERATIONAL' && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Open
              </span>
            )}
            {restaurant.photos_count && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                <Camera className="h-3 w-3 mr-1" />
                {restaurant.photos_count} Photos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <h3 className="text-xl font-bold">Contact & Visit</h3>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Address */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">ADDRESS</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {restaurant.address}
                  {restaurant.neighborhood && <><br />{restaurant.neighborhood}</>}
                  {restaurant.city && <><br />{restaurant.city}, {restaurant.state}</>}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          {restaurant.phone && (
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">PHONE</p>
                  <a 
                    href={`tel:${restaurant.phone}`}
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Website */}
          {restaurant.website && (
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start">
                <Globe className="h-5 w-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-1">WEBSITE</p>
                  <a 
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors break-all"
                  >
                    Visit Website →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          {restaurant.menu_link && (
            <div>
              <div className="flex items-start">
                <BookOpen className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">MENU</p>
                  <a 
                    href={restaurant.menu_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
                  >
                    View Menu →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews & Ratings Card */}
      {(restaurant.rating || restaurant.reviews) && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-yellow-200">
            <Star className="h-6 w-6 text-yellow-500 mr-2 fill-current" />
            Reviews & Ratings
          </h3>

          {/* Overall Rating */}
          {restaurant.rating && (
            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div>
                <p className="text-4xl font-bold text-gray-900">{restaurant.rating}</p>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= (restaurant.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              {restaurant.reviews && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{restaurant.reviews.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
              )}
            </div>
          )}

          {/* Rating Distribution */}
          {restaurant.reviews_per_score && (() => {
            try {
              const reviewsData = JSON.parse(restaurant.reviews_per_score);
              const totalReviews = Object.values(reviewsData).reduce((sum: number, count) => sum + (count as number), 0) || restaurant.reviews || 0;
              
              return (
                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewsData[star] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700 w-8">{star}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              );
            } catch (e) {
              return null;
            }
          })()}

          {/* Popular Keywords */}
          {restaurant.reviews_tags && (() => {
            try {
              const tags = JSON.parse(restaurant.reviews_tags);
              return (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                    Popular Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 8).map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            } catch (e) {
              return null;
            }
          })()}
        </div>
      )}

      {/* Special Features & Amenities Card */}
      {restaurant.additional_features && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-emerald-200">
            <Sparkles className="h-6 w-6 text-emerald-600 mr-2" />
            Features & Amenities
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <MarkdownRenderer content={restaurant.additional_features} />
          </div>
        </div>
      )}

      {/* Booking CTA Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Ready to Book?</h3>
        <p className="text-blue-100 mb-6 text-sm leading-relaxed">
          Reserve your private dining experience today
        </p>
        
        <div className="space-y-3">
          {restaurant.phone && (
            <a 
              href={`tel:${restaurant.phone}`}
              className="block w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Phone className="inline h-5 w-5 mr-2" />
              Call Now
            </a>
          )}
          {(restaurant.booking_appointment_link || restaurant.reservation_links) && (
            <a 
              href={restaurant.booking_appointment_link || restaurant.reservation_links}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border-2 border-white text-white py-3 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <BookOpen className="inline h-5 w-5 mr-2" />
              Book Online
            </a>
          )}
          {restaurant.website && (
            <a 
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white/10 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 text-sm"
            >
              <Globe className="inline h-4 w-4 mr-2" />
              Visit Website
            </a>
          )}
        </div>
      </div>
      
    </div>
  );
}

