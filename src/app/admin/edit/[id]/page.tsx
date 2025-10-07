'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, ArrowLeft, Trash2, Plus, X, Sparkles, Eye, Copy } from 'lucide-react';
import Link from 'next/link';
import ImageKitUpload from '@/components/ImageKitUpload';
import ImageKitMultipleUpload from '@/components/ImageKitMultipleUpload';

interface PrivateRoom {
  name: string;
  capacity: number;
  description?: string;
}

interface RestaurantImage {
  url: string;
  fileId?: string;
  name?: string;
  alt?: string;
  title?: string;
  source?: string;
  website?: {
    url?: string;
    title?: string;
    name?: string;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
  position?: number;
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  full_address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  description?: string;
  short_description?: string;
  image?: string;
  images?: RestaurantImage[];
  rating?: number;
  reviews?: number;
  working_hours?: Record<string, string>;
  category?: string;
  price_range?: string;
  privateRooms: PrivateRoom[];
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  featured?: boolean;
  featuredBy?: string;
  featuredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional Outscraper API fields
  place_id?: string;
  google_id?: string;
  business_status?: string;
  verified?: boolean;
  logo?: string;
  photo?: string;
  street_view?: string;
  time_zone?: string;
  plus_code?: string;
  h3?: string;
  // Service and amenity data (stored as JSON strings)
  service_options?: string;
  highlights?: string;
  popular_for?: string;
  accessibility?: string;
  offerings?: string;
  dining_options?: string;
  amenities?: string;
  atmosphere?: string;
  crowd?: string;
  planning?: string;
  payments?: string;
  parking?: string;
  // Additional data
  typical_time_spent?: string;
  subtypes?: string;
  reviews_tags?: string;
  photos_count?: number;
  reviews_per_score?: string;
  reservation_links?: string;
  booking_appointment_link?: string;
  menu_link?: string;
  order_links?: string;
}

export default function EditRestaurantPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // AI Description Generator states
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [showDescriptionPreview, setShowDescriptionPreview] = useState(false);
  const [descriptionFormat, setDescriptionFormat] = useState<'markdown' | 'json'>('markdown');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    full_address: '',
    neighborhood: '',
    description: '',
    short_description: '',
    image: '',
    images: [] as RestaurantImage[],
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
    status: 'approved' as 'pending' | 'approved' | 'rejected',
    rejectionReason: '',
    featured: false,
    // Additional Outscraper API fields
    place_id: '',
    google_id: '',
    business_status: '',
    verified: false,
    logo: '',
    photo: '',
    street_view: '',
    time_zone: '',
    plus_code: '',
    h3: '',
    service_options: '',
    highlights: '',
    popular_for: '',
    accessibility: '',
    offerings: '',
    dining_options: '',
    amenities: '',
    atmosphere: '',
    crowd: '',
    planning: '',
    payments: '',
    parking: '',
    typical_time_spent: '',
    subtypes: '',
    reviews_tags: '',
    photos_count: '',
    reviews_per_score: '',
    reservation_links: '',
    booking_appointment_link: '',
    menu_link: '',
    order_links: ''
  });
  const [privateRooms, setPrivateRooms] = useState<PrivateRoom[]>([
    { name: '', capacity: 0, description: '' }
  ]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data);
          
          setFormData({
            name: data.name || '',
            address: data.address || '',
            full_address: data.full_address || '',
            neighborhood: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
            postal_code: data.postal_code || '',
            country: data.country || '',
            latitude: data.latitude?.toString() || '',
            longitude: data.longitude?.toString() || '',
            phone: data.phone || '',
            website: data.website || '',
            description: data.description || '',
            short_description: data.short_description || '',
            image: data.image || '',
            images: data.images || [],
            rating: data.rating?.toString() || '',
            reviews: data.reviews?.toString() || '',
            working_hours: data.working_hours ? JSON.stringify(data.working_hours, null, 2) : '',
            category: data.category || '',
            price_range: data.price_range || '',
            status: data.status || 'approved',
            rejectionReason: data.rejectionReason || '',
            featured: data.featured || false,
            // Additional Outscraper API fields
            place_id: data.place_id || '',
            google_id: data.google_id || '',
            business_status: data.business_status || '',
            verified: data.verified || false,
            logo: data.logo || '',
            photo: data.photo || '',
            street_view: data.street_view || '',
            time_zone: data.time_zone || '',
            plus_code: data.plus_code || '',
            h3: data.h3 || '',
            service_options: data.service_options || '',
            highlights: data.highlights || '',
            popular_for: data.popular_for || '',
            accessibility: data.accessibility || '',
            offerings: data.offerings || '',
            dining_options: data.dining_options || '',
            amenities: data.amenities || '',
            atmosphere: data.atmosphere || '',
            crowd: data.crowd || '',
            planning: data.planning || '',
            payments: data.payments || '',
            parking: data.parking || '',
            typical_time_spent: data.typical_time_spent || '',
            subtypes: data.subtypes || '',
            reviews_tags: data.reviews_tags || '',
            photos_count: data.photos_count?.toString() || '',
            reviews_per_score: data.reviews_per_score || '',
            reservation_links: data.reservation_links || '',
            booking_appointment_link: data.booking_appointment_link || '',
            menu_link: data.menu_link || '',
            order_links: data.order_links || ''
          });
          setPrivateRooms(data.privateRooms || [{ name: '', capacity: 0, description: '' }]);
        } else {
          console.error('Failed to fetch restaurant:', response.status);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'verified' ? value === 'true' : value
    }));
  };

  const updateImageField = (index: number, field: keyof RestaurantImage, value: string) => {
    if (!formData.images) return;
    
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const removeImage = (index: number) => {
    if (!formData.images) return;
    
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const generateDescription = async () => {
    setGeneratingDescription(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantData: {
            ...formData,
            privateRooms: privateRooms,
            images: formData.images
          },
          format: descriptionFormat
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedDescription(data.description);
        setShowDescriptionPreview(true);
      } else {
        alert('Failed to generate description: ' + data.message);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Error generating description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const useGeneratedDescription = () => {
    setFormData(prev => ({
      ...prev,
      description: generatedDescription
    }));
    setShowDescriptionPreview(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription);
      alert('Description copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
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
    setSaving(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          full_address: formData.full_address.trim() || undefined,
          neighborhood: formData.neighborhood.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          postal_code: formData.postal_code.trim() || undefined,
          country: formData.country.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          website: formData.website.trim() || undefined,
          description: formData.description.trim() || undefined,
          short_description: formData.short_description.trim() || undefined,
          image: formData.image.trim() || undefined,
          images: formData.images || undefined,
          category: formData.category.trim() || undefined,
          price_range: formData.price_range.trim() || undefined,
          status: formData.status,
          rejectionReason: formData.rejectionReason.trim() || undefined,
          featured: formData.featured,
          privateRooms: privateRooms.filter(room => room.name && room.capacity > 0),
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          reviews: formData.reviews ? parseInt(formData.reviews) : undefined,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
          working_hours: formData.working_hours ? JSON.parse(formData.working_hours) : undefined,
        }),
      });

      if (response.ok) {
        alert('Restaurant updated successfully!');
        router.push('/super-admin');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Error updating restaurant');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Restaurant deleted successfully!');
        router.push('/super-admin');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error deleting restaurant');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to edit restaurants.</p>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/super-admin"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Edit Restaurant</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
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
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Featured Restaurant */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Restaurant
              </label>
              <span className="text-xs text-gray-500">
                (Show in featured section on homepage)
              </span>
            </div>

            {formData.status === 'rejected' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why this restaurant was rejected..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Full Address
                </label>
                <input
                  type="text"
                  name="full_address"
                  value={formData.full_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neighborhood
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="e.g., SoHo, Midtown, Greenwich Village"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
                  placeholder="e.g., $, $$, $$$, $$$$"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (0-5)
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <ImageKitUpload
              onImageUpload={(imageData) => {
                setFormData(prev => ({
                  ...prev,
                  image: imageData.url
                }));
              }}
              onImageRemove={() => {
                setFormData(prev => ({
                  ...prev,
                  image: ''
                }));
              }}
              currentImage={formData.image}
              folder="/restaurants"
            />

            {/* Restaurant Images Section */}
            <ImageKitMultipleUpload
              onImagesChange={(images) => {
                setFormData(prev => ({
                  ...prev,
                  images: images
                }));
              }}
              currentImages={formData.images || []}
              folder="/restaurants"
              maxImages={20}
            />

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
              />
              
              {/* AI Description Generator */}
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-900">AI Description Generator</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={descriptionFormat}
                      onChange={(e) => setDescriptionFormat(e.target.value as 'markdown' | 'json')}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="markdown">Markdown</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">
                  Generate a rich description using all restaurant data including images, private rooms, and metadata.
                </p>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generatingDescription}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generatingDescription ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Description
                      </>
                    )}
                  </button>
                  
                  {generatedDescription && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowDescriptionPreview(!showDescriptionPreview)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showDescriptionPreview ? 'Hide' : 'Preview'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </button>
                      
                      <button
                        type="button"
                        onClick={useGeneratedDescription}
                        className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Use This
                      </button>
                    </>
                  )}
                </div>
                
                {/* Generated Description Preview */}
                {showDescriptionPreview && generatedDescription && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">Generated Description ({descriptionFormat})</h4>
                      <span className="text-xs text-gray-500">{generatedDescription.length} characters</span>
                    </div>
                    {descriptionFormat === 'markdown' ? (
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{generatedDescription}</pre>
                    ) : (
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{JSON.stringify(JSON.parse(generatedDescription), null, 2)}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Brief description for cards and listings (max 150 characters)"
                maxLength={150}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.short_description.length}/150 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours (JSON format)
              </label>
              <textarea
                name="working_hours"
                value={formData.working_hours}
                onChange={handleInputChange}
                rows={4}
                placeholder='{"Monday": "9:00 AM - 10:00 PM", "Tuesday": "9:00 AM - 10:00 PM"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {/* Private Rooms */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Private Dining Rooms</h3>
                <button
                  type="button"
                  onClick={addPrivateRoom}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Room
                </button>
              </div>

              {privateRooms.map((room, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Room {index + 1}</h4>
                    {privateRooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrivateRoom(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
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
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Outscraper Data Fields */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Additional Restaurant Data (Outscraper API)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Status</label>
                  <input
                    type="text"
                    name="business_status"
                    value={formData.business_status || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="OPERATIONAL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verified</label>
                  <select
                    name="verified"
                    value={formData.verified ? 'true' : 'false'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place ID</label>
                  <input
                    type="text"
                    name="place_id"
                    value={formData.place_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ChIJQ-3nEsBZwokRZq2rpFsBSP0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google ID</label>
                  <input
                    type="text"
                    name="google_id"
                    value={formData.google_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0x89c259c012e7ed43:0xfd48015ba4abad66"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <input
                    type="text"
                    name="time_zone"
                    value={formData.time_zone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="America/New_York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plus Code</label>
                  <input
                    type="text"
                    name="plus_code"
                    value={formData.plus_code || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="87G7PXQV+W3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Typical Time Spent</label>
                  <input
                    type="text"
                    name="typical_time_spent"
                    value={formData.typical_time_spent || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="People typically spend up to 4 hours here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos Count</label>
                  <input
                    type="number"
                    name="photos_count"
                    value={formData.photos_count || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5482"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Subtypes</label>
                <input
                  type="text"
                  name="subtypes"
                  value={formData.subtypes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Steak house, American restaurant, Bar, Cocktail bar, Event venue, Fine dining restaurant"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Link</label>
                <input
                  type="url"
                  name="menu_link"
                  value={formData.menu_link || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="http://places.singleplatform.com/stk-downtownmeatpacking-and-stk-rooftop/menu"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Link</label>
                <input
                  type="url"
                  name="booking_appointment_link"
                  value={formData.booking_appointment_link || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://stksteakhouse.com/venues/nyc-rooftop/"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://lh6.googleusercontent.com/-VEemHkJo3i8/AAAAAAAAAAI/AAAAAAAAAAA/Kt9OOPwH_8M/s44-p-k-no-ns-nd/photo.jpg"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://lh3.googleusercontent.com/p/AF1QipPddzlhXg6O3GSB-ne-Aiw1KP-0tKnwqnDI1zlD=w800-h500-k-no"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street View URL</label>
                <input
                  type="url"
                  name="street_view"
                  value={formData.street_view || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://lh3.googleusercontent.com/p/AF1QipN8fly2wyc8uUvO2p3yWHoWulnjF4rxuL3YTW0w=w1600-h1000-k-no"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/super-admin"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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