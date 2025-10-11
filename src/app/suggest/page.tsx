'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, AlertTriangle, Sparkles, Camera, MapPin, FileText, Clock, ChevronDown, ChevronUp, Info, Zap, CheckCircle } from 'lucide-react';
import RestaurantSearchModal from '@/components/suggest/RestaurantSearchModal';
import AutoPopulatedIndicator from '@/components/suggest/AutoPopulatedIndicator';
import SuccessMessage from '@/components/suggest/SuccessMessage';
import BasicInfoFields from '@/components/suggest/BasicInfoFields';
import ContactInfoFields from '@/components/suggest/ContactInfoFields';
import LocationInfoFields from '@/components/suggest/LocationInfoFields';
import PrivateDiningFields from '@/components/suggest/PrivateDiningFields';

export default function SuggestRestaurantPage() {
  const { data: session } = useSession();
  const [showInstructions, setShowInstructions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    phone: '',
    website: '',
    description: '',
    image: '',
    images: [] as any[],
    category: '',
    price_range: '',
    neighborhood: '',
    postal_code: '',
    email: '',
    rating: '',
    reviews: '',
    private_rooms: '',
    capacity: '',
    special_features: '',
    cuisine_type: '',
    atmosphere: '',
    dress_code: '',
    parking: '',
    accessibility: '',
    hours: '',
    best_for: '',
    contact_person: '',
    notes: '',
    short_description: '',
    place_id: '',
    google_id: '',
    business_status: '',
    verified: '',
    logo: '',
    photo: '',
    street_view: '',
    time_zone: '',
    plus_code: '',
    h3: '',
    service_options: '',
    highlights: '',
    popular_for: '',
    offerings: '',
    dining_options: '',
    amenities: '',
    crowd: '',
    planning: '',
    payments: '',
    typical_time_spent: '',
    subtypes: '',
    reviews_tags: '',
    photos_count: '',
    reviews_per_score: '',
    reservation_links: '',
    booking_appointment_link: '',
    menu_link: '',
    order_links: '',
    latitude: '',
    longitude: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);
  
  // Restaurant search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('Manhattan, NY, USA');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Photo fetching states
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [photosError, setPhotosError] = useState('');
  const [photosProgress, setPhotosProgress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchRestaurants = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const response = await fetch('/api/search-restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location: searchLocation
        }),
      });

      const data = await response.json();

      if (data.success) {
        let restaurants = [];
        if (data.restaurants && Array.isArray(data.restaurants)) {
          restaurants = data.restaurants;
        } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          restaurants = data.data[0] || [];
        }
        
        setSearchResults(restaurants);
        setShowSearchResults(true);
      } else {
        setSearchError(data.message || 'Search failed');
      }
    } catch (error) {
      setSearchError('Failed to search restaurants');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectRestaurant = async (restaurant: any) => {
    // Determine neighborhood using geofencing API
    let neighborhood = restaurant.city || 'New York';
    if (restaurant.latitude && restaurant.longitude) {
      try {
        const response = await fetch('/api/geofence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            city: restaurant.city || 'New York'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          neighborhood = data.neighborhood;
        }
      } catch (error) {
        // Use default neighborhood
      }
    }

    // Auto-populate form with restaurant data
    const newFormData = {
      name: restaurant.name || '',
      address: restaurant.full_address || restaurant.street || restaurant.address || '',
      city: restaurant.city || '',
      state: restaurant.state || restaurant.us_state || '',
      neighborhood: neighborhood,
      postal_code: restaurant.postal_code || '',
      phone: restaurant.phone || '',
      website: restaurant.website || restaurant.site || `https://${restaurant.name.toLowerCase().replace(/\s+/g, '')}.com`,
      image: restaurant.photo || restaurant.logo || '',
      short_description: restaurant.description || `Private dining available at ${restaurant.name}`,
      description: '',
      category: restaurant.category || restaurant.type || '',
      price_range: restaurant.price_range || restaurant.range || '$$$',
      rating: restaurant.rating?.toString() || '',
      reviews: restaurant.reviews?.toString() || '',
      latitude: restaurant.latitude?.toString() || '',
      longitude: restaurant.longitude?.toString() || '',
      private_rooms: '1',
      capacity: '20',
      special_features: 'Private dining rooms available',
      cuisine_type: restaurant.type || restaurant.category || '',
      atmosphere: restaurant.atmosphere || 'Upscale dining experience',
      best_for: restaurant.popular_for || 'Business meetings, celebrations, private events',
      dress_code: 'Business casual',
      parking: restaurant.parking || 'Valet parking available',
      accessibility: restaurant.accessibility || 'Wheelchair accessible',
      hours: restaurant.working_hours ? JSON.stringify(restaurant.working_hours, null, 2) : 
        '{\n  "Monday": "11:00 AM - 10:00 PM",\n  "Tuesday": "11:00 AM - 10:00 PM",\n  "Wednesday": "11:00 AM - 10:00 PM",\n  "Thursday": "11:00 AM - 10:00 PM",\n  "Friday": "11:00 AM - 11:00 PM",\n  "Saturday": "11:00 AM - 11:00 PM",\n  "Sunday": "11:00 AM - 10:00 PM"\n}',
      contact_person: 'Restaurant Manager',
      notes: `Found via Outscraper API - ${restaurant.place_id ? `Place ID: ${restaurant.place_id}` : 'Verified restaurant data'}. Please add detailed markdown description for private dining features.`,
      place_id: restaurant.place_id || '',
      google_id: restaurant.google_id || '',
      business_status: restaurant.business_status || '',
      verified: restaurant.verified?.toString() || '',
      logo: restaurant.logo || '',
      photo: restaurant.photo || '',
      street_view: restaurant.street_view || '',
      time_zone: restaurant.time_zone || '',
      plus_code: restaurant.plus_code || '',
      h3: restaurant.h3 || '',
      service_options: restaurant.service_options ? JSON.stringify(restaurant.service_options) : '',
      highlights: restaurant.highlights ? JSON.stringify(restaurant.highlights) : '',
      popular_for: restaurant.popular_for ? JSON.stringify(restaurant.popular_for) : '',
      offerings: restaurant.offerings ? JSON.stringify(restaurant.offerings) : '',
      dining_options: restaurant.dining_options ? JSON.stringify(restaurant.dining_options) : '',
      amenities: restaurant.amenities ? JSON.stringify(restaurant.amenities) : '',
      crowd: restaurant.crowd ? JSON.stringify(restaurant.crowd) : '',
      planning: restaurant.planning ? JSON.stringify(restaurant.planning) : '',
      payments: restaurant.payments ? JSON.stringify(restaurant.payments) : '',
      typical_time_spent: restaurant.typical_time_spent || '',
      subtypes: restaurant.subtypes || '',
      reviews_tags: restaurant.reviews_tags ? JSON.stringify(restaurant.reviews_tags) : '',
      photos_count: restaurant.photos_count?.toString() || '',
      reviews_per_score: restaurant.reviews_per_score ? JSON.stringify(restaurant.reviews_per_score) : '',
      reservation_links: restaurant.reservation_links ? JSON.stringify(restaurant.reservation_links) : '',
      booking_appointment_link: restaurant.booking_appointment_link || '',
      menu_link: restaurant.menu_link || '',
      order_links: restaurant.order_links ? JSON.stringify(restaurant.order_links) : ''
    };
    
    setFormData(prev => ({ ...prev, ...newFormData }));
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleFetchPhotos = async () => {
    if (!formData.name || !formData.address) {
      setPhotosError('Please enter restaurant name and address first');
      return;
    }

    setFetchingPhotos(true);
    setPhotosError('');
    setPhotosProgress('Searching for photos...');

    try {
      const response = await fetch('/api/fetch-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `${formData.name}, ${formData.address}`,
          restaurantName: formData.name
        })
      });

      const data = await response.json();

      if (data.success && data.photos) {
        setPhotosProgress(`Found ${data.photos.length} photos! Uploading to ImageKit...`);
        
        try {
          if (data.photos.length > 0) {
            const uploadResponse = await fetch('/api/upload-images-from-urls', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                images: data.photos,
                restaurantName: formData.name,
                folder: '/restaurants'
              })
            });

            const uploadData = await uploadResponse.json();

            if (uploadData.success && uploadData.data) {
              setFormData(prev => ({ ...prev, images: uploadData.data }));
              setPhotosProgress(`Successfully uploaded ${uploadData.data.length} images!`);
              setTimeout(() => {
                setPhotosProgress('');
                setFetchingPhotos(false);
              }, 2000);
            } else {
              throw new Error('Failed to upload images');
            }
          }
        } catch (uploadError) {
          setPhotosError('Failed to upload images to ImageKit');
          setFetchingPhotos(false);
        }
      } else {
        setPhotosError(data.message || 'Failed to fetch photos');
        setFetchingPhotos(false);
      }
    } catch (error) {
      setPhotosError('Failed to fetch photos');
      setFetchingPhotos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        submittedBy: session?.user?.email || 'anonymous'
      };

      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        setSuccess(true);
        
        // Start countdown and refresh the page after 3 seconds
        let countdownValue = 3;
        setCountdown(countdownValue);
        
        const countdownInterval = setInterval(() => {
          countdownValue--;
          setCountdown(countdownValue);
          
          if (countdownValue <= 0) {
            clearInterval(countdownInterval);
            window.location.reload();
          }
        }, 1000);
        
        // Clear form data immediately (optional - page will refresh anyway)
        setFormData({
          name: '', address: '', city: '', state: '', country: 'United States', phone: '', website: '', description: '', image: '', images: [], category: '', price_range: '', neighborhood: '', postal_code: '', email: '', rating: '', reviews: '', private_rooms: '', capacity: '', special_features: '', cuisine_type: '', atmosphere: '', dress_code: '', parking: '', accessibility: '', hours: '', best_for: '', contact_person: '', notes: '', short_description: '', place_id: '', google_id: '', business_status: '', verified: '', logo: '', photo: '', street_view: '', time_zone: '', plus_code: '', h3: '', service_options: '', highlights: '', popular_for: '', offerings: '', dining_options: '', amenities: '', crowd: '', planning: '', payments: '', typical_time_spent: '', subtypes: '', reviews_tags: '', photos_count: '', reviews_per_score: '', reservation_links: '', booking_appointment_link: '', menu_link: '', order_links: '', latitude: '', longitude: ''
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Submission failed.');
      }
    } catch (err) {
      setError('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-8 shadow-2xl border border-white/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Suggest a Restaurant
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              Help us grow our collection by suggesting restaurants with private dining options
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Instructions Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">How to Use This Form</h2>
                  <p className="text-sm text-gray-600">Click to {showInstructions ? 'hide' : 'view'} step-by-step instructions</p>
                </div>
              </div>
              {showInstructions ? (
                <ChevronUp className="h-6 w-6 text-gray-400" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </button>

          {showInstructions && (
            <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Search for Restaurant',
                    description: 'Use the "Search Restaurant" button to auto-populate the form with verified data from Google Maps.',
                    icon: Search,
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    step: '2',
                    title: 'Verify Information',
                    description: 'Review the auto-populated data and make any necessary corrections or additions.',
                    icon: CheckCircle,
                    color: 'from-emerald-500 to-emerald-600'
                  },
                  {
                    step: '3',
                    title: 'Fetch Photos',
                    description: 'Click "Fetch Restaurant Photos" to automatically download and upload high-quality images.',
                    icon: Camera,
                    color: 'from-purple-500 to-purple-600'
                  },
                  {
                    step: '4',
                    title: 'Add Details',
                    description: 'Fill in private dining specific information like room capacity, special features, and detailed descriptions.',
                    icon: FileText,
                    color: 'from-pink-500 to-pink-600'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-full text-sm font-bold mr-2">
                            {item.step}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Pro Tip:</h4>
                    <p className="text-sm text-blue-700">
                      Using the search feature saves time and ensures accurate data. The system automatically fetches restaurant details, coordinates, photos, and more from Google Maps!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Form Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 md:p-8">
          {/* Search Button */}
          <button
            onClick={() => setShowSearchResults(true)}
            className="w-full mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-lg font-semibold group"
          >
            <Search className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
            Search Restaurant to Auto-Populate Form
          </button>

          {/* Search Modal */}
          <RestaurantSearchModal
            isOpen={showSearchResults}
            onClose={() => setShowSearchResults(false)}
            onSelectRestaurant={handleSelectRestaurant}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
            onSearch={handleSearchRestaurants}
            searching={searching}
            searchResults={searchResults}
            searchError={searchError}
          />

          {/* Auto-Populated Indicator */}
          <AutoPopulatedIndicator 
            isAutoPopulated={!!(formData.name && formData.notes?.includes('Outscraper API'))} 
          />

          {success ? (
            <SuccessMessage countdown={countdown} />
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {photosProgress && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center">
                  <Camera className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{photosProgress}</span>
                </div>
              )}

              {photosError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{photosError}</span>
                </div>
              )}

              {/* Fetch Photos Button */}
              {formData.name && formData.address && (
                <button
                  onClick={handleFetchPhotos}
                  disabled={fetchingPhotos}
                  className="w-full mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center font-semibold group"
                >
                  <Camera className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {fetchingPhotos ? 'Fetching Photos...' : 'Fetch Restaurant Photos (Optional)'}
                </button>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <BasicInfoFields 
                  formData={formData} 
                  handleChange={handleChange} 
                  readOnly={!!formData.place_id}
                />

                {/* Contact Info */}
                <ContactInfoFields 
                  formData={formData} 
                  handleChange={handleChange} 
                  readOnly={!!formData.place_id}
                />

                {/* Location Info */}
                <LocationInfoFields 
                  formData={formData} 
                  handleChange={handleChange} 
                  readOnly={!!formData.place_id}
                />

                {/* Private Dining Details */}
                <PrivateDiningFields 
                  formData={formData} 
                  handleChange={handleChange} 
                  onImageUpload={(imageData) => setFormData(prev => ({ ...prev, image: imageData.url }))}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  readOnly={!!formData.place_id}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8 rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Help Section */}
        {!success && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                What Happens Next?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                After you submit your suggestion, here&apos;s what to expect
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Review Process',
                    description: 'Our team will review your submission within 24-48 hours',
                    icon: FileText,
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    step: '2',
                    title: 'Verification',
                    description: 'We verify restaurant details and private dining availability',
                    icon: CheckCircle,
                    color: 'from-purple-500 to-purple-600'
                  },
                  {
                    step: '3',
                    title: 'Publication',
                    description: 'Approved restaurants are added to our directory immediately',
                    icon: Sparkles,
                    color: 'from-pink-500 to-pink-600'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full text-sm font-bold mb-2">
                        {item.step}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
