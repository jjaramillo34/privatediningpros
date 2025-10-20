'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Building2, Plus, DoorOpen, MapPin, RefreshCw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface PrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
  description?: string;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  description?: string;
  privateRooms: PrivateRoom[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    image: '',
    phone: '',
    website: '',
    category: '',
    price_range: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    latitude: '',
    longitude: '',
    rating: '',
    reviews: '',
    working_hours: '',
  });
  const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([
    { name: '', capacity: 0, description: '' }
  ]);
  const [backgroundProcessing, setBackgroundProcessing] = useState({
    loading: false,
    result: null as any,
    error: null as string | null
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be signed in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivateRoomChange = (index: number, field: keyof PrivateRoom, value: string | number) => {
    const updatedRooms = [...privateRooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value
    };
    setPrivateRooms(updatedRooms);
  };

  const addPrivateRoom = () => {
    setPrivateRooms([...privateRooms, { name: '', capacity: 0, description: '' }]);
  };

  const removePrivateRoom = (index: number) => {
    if (privateRooms.length > 1) {
      setPrivateRooms(privateRooms.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          privateRooms: privateRooms.filter(room => room.name && room.capacity > 0),
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          reviews: formData.reviews ? parseInt(formData.reviews) : undefined,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        }),
      });

      if (response.ok) {
        const newRestaurant = await response.json();
        setRestaurants([...restaurants, newRestaurant]);
        
        // Reset form
        setFormData({
          name: '',
          address: '',
          description: '',
          image: '',
          phone: '',
          website: '',
          category: '',
          price_range: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'United States',
          latitude: '',
          longitude: '',
          rating: '',
          reviews: '',
          working_hours: '',
        });
        setPrivateRooms([{ name: '', capacity: 0, description: '' }]);
        
        alert('Restaurant added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Error adding restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundProcessing = async (action: string) => {
    setBackgroundProcessing({ loading: true, result: null, error: null });
    
    try {
      const response = await fetch('/api/admin/process-restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();
      
      if (result.success) {
        setBackgroundProcessing({ loading: false, result, error: null });
      } else {
        setBackgroundProcessing({ loading: false, result: null, error: result.message });
      }
    } catch (error) {
      setBackgroundProcessing({ 
        loading: false, 
        result: null, 
        error: 'Failed to process background job' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            {session.user?.role === 'super_admin' && (
              <a
                href="/super-admin"
                className="ml-auto inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
              >
                Go to Super Admin Dashboard
              </a>
            )}
          </div>

          {/* Background Processing Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Background Processing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => handleBackgroundProcessing('process-pending')}
                disabled={backgroundProcessing.loading}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {backgroundProcessing.loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                Process Pending Restaurants
              </button>
              
              <button
                onClick={() => handleBackgroundProcessing('validate-restaurant')}
                disabled={backgroundProcessing.loading}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {backgroundProcessing.loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Validate Restaurant Data
              </button>
            </div>

            {/* Background Processing Results */}
            {backgroundProcessing.result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Processing Complete</h3>
                    <p className="text-sm text-green-700">{backgroundProcessing.result.message}</p>
                    {backgroundProcessing.result.data && (
                      <div className="mt-2 text-xs text-green-600">
                        <pre>{JSON.stringify(backgroundProcessing.result.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {backgroundProcessing.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Processing Failed</h3>
                    <p className="text-sm text-red-700">{backgroundProcessing.error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Background Processing Info</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    • Process Pending: Geocodes addresses for restaurants missing coordinates<br/>
                    • Validate Data: Cleans and validates restaurant information<br/>
                    • You can also set up automated cron jobs using: <code className="bg-blue-100 px-1 rounded">/api/cron/process-restaurants</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Fine Dining, Italian, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleInputChange}
                  placeholder="e.g., $$, $$$"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours
                </label>
                <input
                  type="text"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri: 11AM-10PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the restaurant, its atmosphere, and specialties..."
              />
            </div>

            {/* Private Rooms */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <DoorOpen className="h-5 w-5" />
                  Private Rooms
                </h3>
                <button
                  type="button"
                  onClick={addPrivateRoom}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Room
                </button>
              </div>

              <div className="space-y-4">
                {privateRooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Room {index + 1}</h4>
                      {privateRooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePrivateRoom(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Room Name
                        </label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => handlePrivateRoomChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Wine Cellar, Garden Room"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={room.capacity}
                          onChange={(e) => handlePrivateRoomChange(index, 'capacity', parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Number of guests"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={room.description || ''}
                          onChange={(e) => handlePrivateRoomChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Restaurant
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 