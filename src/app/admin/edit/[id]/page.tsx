'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, ArrowLeft, Trash2, Plus, X, Sparkles, Eye, Copy, Image as ImageIcon, Edit3, RefreshCw, Database, Download } from 'lucide-react';
import Link from 'next/link';
import ImageKitUpload from '@/components/ImageKitUpload';
import ImageKitMultipleUpload from '@/components/ImageKitMultipleUpload';

interface PrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
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
  additional_features?: string;
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
  
  // JSON Parser states
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonParser, setShowJsonParser] = useState(false);
  const [jsonParseError, setJsonParseError] = useState('');
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  // Notification states
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  
  // Image metadata editor states
  const [showImageMetadataEditor, setShowImageMetadataEditor] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [imageMetadata, setImageMetadata] = useState<RestaurantImage>({
    url: '',
    alt: '',
    title: '',
    source: 'Manual Upload',
    website: {
      url: '',
      title: '',
      name: ''
    },
    dimensions: {
      width: 0,
      height: 0
    },
    position: 1
  });

  // Data enhancement states
  const [isEnhancingData, setIsEnhancingData] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState('');
  
  // Image fetching states
  const [isFetchingImages, setIsFetchingImages] = useState(false);
  const [imageFetchProgress, setImageFetchProgress] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    full_address: '',
    neighborhood: '',
    description: '',
    short_description: '',
    additional_features: '',
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
    { name: '', capacity: 0, setup: '', description: '' }
  ]);

  // Show notification helper
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

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
            additional_features: data.additional_features || '',
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
          setPrivateRooms(data.privateRooms || [{ name: '', capacity: 0, setup: '', description: '' }]);
        } else {
          // Failed to fetch restaurant
        }
      } catch (error) {
        // Error fetching restaurant
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);


  // Image metadata management functions
  const openImageMetadataEditor = (index?: number) => {
    if (index !== undefined && formData.images?.[index]) {
      // Edit existing image
      setEditingImageIndex(index);
      setImageMetadata(formData.images[index]);
    } else {
      // Add new image
      setEditingImageIndex(null);
      setImageMetadata({
        url: '',
        alt: `${formData.name} - Image ${(formData.images?.length || 0) + 1}`,
        title: formData.name || '',
        source: 'Manual Upload',
        website: {
          url: formData.website || '',
          title: formData.name || '',
          name: ''
        },
        dimensions: {
          width: 0,
          height: 0
        },
        position: (formData.images?.length || 0) + 1
      });
    }
    setShowImageMetadataEditor(true);
  };

  const closeImageMetadataEditor = () => {
    setShowImageMetadataEditor(false);
    setEditingImageIndex(null);
  };

  const saveImageMetadata = () => {
    const images = [...(formData.images || [])];
    
    if (editingImageIndex !== null) {
      // Update existing image
      images[editingImageIndex] = imageMetadata;
      showNotification('Image metadata updated successfully!');
    } else {
      // Add new image
      images.push(imageMetadata);
      showNotification('Image added successfully!');
    }
    
    setFormData(prev => ({ ...prev, images }));
    closeImageMetadataEditor();
  };

  const deleteImage = (index: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const images = [...(formData.images || [])];
      images.splice(index, 1);
      // Update positions
      images.forEach((img, idx) => {
        img.position = idx + 1;
      });
      setFormData(prev => ({ ...prev, images }));
      showNotification('Image deleted successfully!');
    }
  };

  // Fetch images function
  const fetchRestaurantImages = async () => {
    if (!restaurant) return;
    
    setIsFetchingImages(true);
    setImageFetchProgress('Searching for restaurant images...');
    
    // Progress indicator updater
    let elapsedSeconds = 0;
    const progressMessages = [
      { time: 0, message: 'Searching for restaurant images...' },
      { time: 10, message: 'Attempt 1/5: Searching with full restaurant details...' },
      { time: 20, message: 'Attempt 2/5: Trying with "restaurant" keyword...' },
      { time: 30, message: 'Attempt 3/5: Searching with "photos" keyword...' },
      { time: 40, message: 'Attempt 4/5: Simplifying search query...' },
      { time: 50, message: 'Attempt 5/5: Final attempt with restaurant name only...' },
      { time: 60, message: 'Still searching... This may take up to 2 minutes...' }
    ];
    
    const progressInterval = setInterval(() => {
      elapsedSeconds += 5;
      const currentMessage = progressMessages
        .reverse()
        .find(pm => elapsedSeconds >= pm.time);
      if (currentMessage) {
        setImageFetchProgress(currentMessage.message);
      }
    }, 5000); // Update every 5 seconds
    
    try {
      // Construct query string similar to suggest page
      const query = `${restaurant.name}, ${restaurant.address}${restaurant.city ? ', ' + restaurant.city : ''}${restaurant.state ? ', ' + restaurant.state : ''}`;
      
      const photosResponse = await fetch('/api/fetch-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          photosLimit: 5
        })
      });
      
      clearInterval(progressInterval);
      
      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        
        if (photosData.photos && photosData.photos.length > 0) {
          setImageFetchProgress(`Found ${photosData.photos.length} images! Uploading to ImageKit...`);
          
          // Upload images to ImageKit using bulk upload API
          const uploadResponse = await fetch('/api/upload-images-from-urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              images: photosData.photos,
              restaurantName: restaurant.name,
              folder: '/restaurants'
            })
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            
            if (uploadData.success && uploadData.data && uploadData.data.length > 0) {
              // Format images with metadata
              const formattedImages = uploadData.data.map((uploadResult: any, idx: number) => ({
                url: uploadResult.url,
                fileId: uploadResult.fileId,
                name: uploadResult.name,
                alt: `${restaurant.name}, ${restaurant.address} - Image ${idx + 1}`,
                title: uploadResult.fileName || `${restaurant.name}`,
                source: 'Outscraper',
                website: null,
                dimensions: null,
                position: idx + 1
              }));
              
              setFormData(prev => ({
                ...prev,
                images: formattedImages as RestaurantImage[]
              }));
              
              showNotification(`Successfully fetched and uploaded ${formattedImages.length} images!`);
            } else {
              showNotification('Failed to upload images to ImageKit.', 'error');
            }
          } else {
            showNotification('Failed to upload images to ImageKit.', 'error');
          }
        } else {
          showNotification('No images found for this restaurant.', 'error');
        }
      } else {
        const errorData = await photosResponse.json();
        throw new Error(errorData.error || 'Failed to fetch photos');
      }
    } catch (error) {
      clearInterval(progressInterval);
      showNotification('Error fetching images: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setIsFetchingImages(false);
      setImageFetchProgress('');
    }
  };

  // Data enhancement function
  const enhanceRestaurantData = async () => {
    if (!restaurant) return;
    
    setIsEnhancingData(true);
    setEnhancementProgress('Starting data enhancement...');
    
    try {
      // Step 1: Fetch additional data from Outscraper
      setEnhancementProgress('Fetching additional data from Outscraper...');
      const outscraperResponse = await fetch('/api/outscraper-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: restaurant.name,
          address: restaurant.address,
          city: restaurant.city,
          state: restaurant.state
        })
      });
      
      if (outscraperResponse.ok) {
        const outscraperData = await outscraperResponse.json();
        
        // Check if API returned an error
        if (outscraperData.error) {
          throw new Error(outscraperData.error + (outscraperData.details ? `: ${outscraperData.details}` : ''));
        }
        
        // Step 2: Fetch photos (optional, don't fail if it errors)
        let photosData = null;
        try {
          setEnhancementProgress('Fetching restaurant photos...');
          const query = `${restaurant.name}, ${restaurant.address}${restaurant.city ? ', ' + restaurant.city : ''}${restaurant.state ? ', ' + restaurant.state : ''}`;
          
          const photosResponse = await fetch('/api/fetch-photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: query,
              photosLimit: 5
            })
          });
          
          if (photosResponse.ok) {
            photosData = await photosResponse.json();
          }
        } catch (photoError) {
          // Silently continue if photos fetch fails
        }
        
        // Step 3: Generate enhanced description (optional, don't fail if it errors)
        let enhancedDescription = '';
        try {
          setEnhancementProgress('Generating enhanced description...');
          const descriptionResponse = await fetch('/api/generate-description', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              restaurantData: {
                ...restaurant,
                ...outscraperData,
                images: photosData?.photos || []
              }
            })
          });
          
          if (descriptionResponse.ok) {
            const descData = await descriptionResponse.json();
            enhancedDescription = descData.description;
          }
        } catch (descError) {
          // Silently continue if description generation fails
        }
        
        // Step 4: Update form data with enhanced information
        setEnhancementProgress('Updating restaurant data...');
        const updates: any = {};
        
        // Update basic info (always update to get latest data)
        if (outscraperData.phone) {
          updates.phone = outscraperData.phone;
        }
        if (outscraperData.website) {
          updates.website = outscraperData.website;
        }
        if (outscraperData.rating) {
          updates.rating = outscraperData.rating.toString();
        }
        if (outscraperData.reviews) {
          updates.reviews = outscraperData.reviews.toString();
        }
        if (outscraperData.price_range) {
          updates.price_range = outscraperData.price_range;
        }
        if (outscraperData.category) {
          updates.category = outscraperData.category;
        }
        if (outscraperData.working_hours) {
          updates.working_hours = JSON.stringify(outscraperData.working_hours, null, 2);
        }
        
        // Build additional features from 'about' object if available
        if (outscraperData.about && typeof outscraperData.about === 'object') {
          const featuresArray: string[] = [];
          
          // Extract features from different categories
          Object.entries(outscraperData.about).forEach(([category, items]) => {
            if (typeof items === 'object' && items !== null) {
              Object.entries(items as Record<string, any>).forEach(([feature, value]) => {
                if (value === true) {
                  featuresArray.push(feature);
                }
              });
            }
          });
          
          if (featuresArray.length > 0) {
            updates.additional_features = `- ${featuresArray.join('\n- ')}`;
          }
        } else if (outscraperData.additional_features && !formData.additional_features) {
          updates.additional_features = outscraperData.additional_features;
        }
        
        // Update metadata fields
        if (outscraperData.business_status) {
          updates.business_status = outscraperData.business_status;
        }
        if (outscraperData.place_id) {
          updates.place_id = outscraperData.place_id;
        }
        if (outscraperData.google_id) {
          updates.google_id = outscraperData.google_id;
        }
        if (outscraperData.plus_code) {
          updates.plus_code = outscraperData.plus_code;
        }
        if (outscraperData.verified !== undefined) {
          updates.verified = outscraperData.verified;
        }
        if (outscraperData.photos_count) {
          updates.photos_count = outscraperData.photos_count;
        }
        if (outscraperData.reviews_per_score) {
          updates.reviews_per_score = typeof outscraperData.reviews_per_score === 'string' 
            ? outscraperData.reviews_per_score 
            : JSON.stringify(outscraperData.reviews_per_score);
        }
        if (outscraperData.reviews_tags) {
          updates.reviews_tags = typeof outscraperData.reviews_tags === 'string'
            ? outscraperData.reviews_tags
            : JSON.stringify(outscraperData.reviews_tags);
        }
        if (outscraperData.logo) {
          updates.logo = outscraperData.logo;
        }
        if (outscraperData.subtypes) {
          updates.subtypes = outscraperData.subtypes;
        }
        if (outscraperData.menu_link) {
          updates.menu_link = outscraperData.menu_link;
        }
        if (outscraperData.booking_appointment_link) {
          updates.booking_appointment_link = outscraperData.booking_appointment_link;
        }
        if (outscraperData.street_view) {
          updates.street_view = outscraperData.street_view;
        }
        if (outscraperData.photo) {
          updates.photo = outscraperData.photo;
        }
        
        // Update private rooms if any
        if (outscraperData.privateRooms && outscraperData.privateRooms.length > 0) {
          setPrivateRooms(outscraperData.privateRooms);
        }
        
        // Update description if enhanced
        if (enhancedDescription) {
          updates.description = enhancedDescription;
        }
        
        // Update images if fetched
        if (photosData?.photos && photosData.photos.length > 0) {
          updates.images = photosData.photos;
        }
        
        // Apply updates to form data
        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({ ...prev, ...updates }));
          showNotification(`Data enhanced successfully! Updated ${Object.keys(updates).length} fields.`);
        } else {
          showNotification('No new data found to enhance this restaurant.');
        }
        
        setEnhancementProgress('Data enhancement completed!');
      } else {
        const errorData = await outscraperResponse.json();
        throw new Error(errorData.error || errorData.details || `Failed to fetch data from Outscraper (${outscraperResponse.status})`);
      }
    } catch (error) {
      showNotification('Error enhancing data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsEnhancingData(false);
      setEnhancementProgress('');
    }
  };

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
        showNotification('Description generated successfully!');
      } else {
        showNotification('Failed to generate description: ' + data.message, 'error');
      }
    } catch (error) {
      showNotification('Error generating description', 'error');
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
      showNotification('Description copied to clipboard!');
    } catch (error) {
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const generateAIPrompt = () => {
    const restaurantName = formData.name || '[Restaurant Name]';
    const restaurantAddress = formData.address || '[Restaurant Address]';
    
    const prompt = `${restaurantName}
${restaurantAddress}

Can you create a list of private rooms options, website, category, price_range with dollars sign ($), additional features and short_description (150 characters long) for this restaurant in JSON format with the following keys:

{
  "restaurant_name": "",
  "address": "",
  "website": "",
  "category": "",
  "price_range": "",
  "private_rooms": [
    {
      "room_name": "",
      "capacity": 0,
      "setup": "",
      "features": []
    }
  ],
  "additional_features": [],
  "short_description": ""
}`;

    setGeneratedPrompt(prompt);
    setShowPromptGenerator(true);
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      showNotification('Prompt copied to clipboard! Paste it into ChatGPT, Perplexity or Claude.');
    } catch (error) {
      showNotification('Failed to copy prompt to clipboard', 'error');
    }
  };

  const parseJsonData = () => {
    setJsonParseError('');
    
    try {
      const parsedData = JSON.parse(jsonInput);
      
      // Parse website
      if (parsedData.website) {
        setFormData(prev => ({
          ...prev,
          website: parsedData.website
        }));
      }
      
      // Parse category
      if (parsedData.category) {
        setFormData(prev => ({
          ...prev,
          category: parsedData.category
        }));
      }

      // Parse price_range
      if (parsedData.price_range) {
        setFormData(prev => ({
          ...prev,
          price_range: parsedData.price_range
        }));
      }
      
      // Parse short_description
      if (parsedData.short_description) {
        setFormData(prev => ({
          ...prev,
          short_description: parsedData.short_description
        }));
      }
      
      // Parse additional_features (array to markdown list)
      if (parsedData.additional_features && Array.isArray(parsedData.additional_features)) {
        const featuresMarkdown = parsedData.additional_features
          .map((feature: string) => `- ${feature}`)
          .join('\n');
        setFormData(prev => ({
          ...prev,
          additional_features: featuresMarkdown
        }));
      }
      
      // Parse private_rooms
      if (parsedData.private_rooms && Array.isArray(parsedData.private_rooms)) {
        const parsedRooms = parsedData.private_rooms.map((room: {
          room_name?: string;
          capacity?: number;
          setup?: string;
          features?: string[];
        }) => {
          let description = '';
          
          // Build description from features only
          if (room.features && Array.isArray(room.features)) {
            description = room.features.map((f: string) => `- ${f}`).join('\n');
          }
          
          return {
            name: room.room_name || '',
            capacity: room.capacity || 0,
            setup: room.setup || '',
            description: description.trim()
          };
        });
        
        setPrivateRooms(parsedRooms);
      }
      
      showNotification('JSON parsed successfully! Data has been populated into the form fields.');
      setJsonInput('');
      setShowJsonParser(false);
      
    } catch (error) {
      setJsonParseError(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    setPrivateRooms([...privateRooms, { name: '', capacity: 0, setup: '', description: '' }]);
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
          additional_features: formData.additional_features.trim() || undefined,
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
          // Outscraper API fields
          place_id: formData.place_id.trim() || undefined,
          google_id: formData.google_id.trim() || undefined,
          business_status: formData.business_status.trim() || undefined,
          verified: formData.verified,
          logo: formData.logo.trim() || undefined,
          photo: formData.photo.trim() || undefined,
          street_view: formData.street_view.trim() || undefined,
          time_zone: formData.time_zone.trim() || undefined,
          plus_code: formData.plus_code.trim() || undefined,
          h3: formData.h3.trim() || undefined,
          service_options: formData.service_options.trim() || undefined,
          highlights: formData.highlights.trim() || undefined,
          popular_for: formData.popular_for.trim() || undefined,
          accessibility: formData.accessibility.trim() || undefined,
          offerings: formData.offerings.trim() || undefined,
          dining_options: formData.dining_options.trim() || undefined,
          amenities: formData.amenities.trim() || undefined,
          atmosphere: formData.atmosphere.trim() || undefined,
          crowd: formData.crowd.trim() || undefined,
          planning: formData.planning.trim() || undefined,
          payments: formData.payments.trim() || undefined,
          parking: formData.parking.trim() || undefined,
          typical_time_spent: formData.typical_time_spent.trim() || undefined,
          subtypes: formData.subtypes.trim() || undefined,
          reviews_tags: formData.reviews_tags.trim() || undefined,
          photos_count: formData.photos_count ? parseInt(formData.photos_count) : undefined,
          reviews_per_score: formData.reviews_per_score.trim() || undefined,
          reservation_links: formData.reservation_links.trim() || undefined,
          booking_appointment_link: formData.booking_appointment_link.trim() || undefined,
          menu_link: formData.menu_link.trim() || undefined,
          order_links: formData.order_links.trim() || undefined,
        }),
      });

      if (response.ok) {
        showNotification('Restaurant updated successfully!');
        setTimeout(() => {
          router.push('/super-admin');
        }, 1000);
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      showNotification('Error updating restaurant', 'error');
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
        showNotification('Restaurant deleted successfully!');
        setTimeout(() => {
          router.push('/super-admin');
        }, 1000);
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      showNotification('Error deleting restaurant', 'error');
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
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl border-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={enhanceRestaurantData}
                disabled={isEnhancingData || loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Database className="h-4 w-4 mr-2" />
                {isEnhancingData ? 'Enhancing...' : 'Enhance Data'}
              </button>
              <button
                onClick={fetchRestaurantImages}
                disabled={isFetchingImages || loading}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                {isFetchingImages ? 'Fetching...' : 'Fetch Images'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Enhancement Progress */}
          {isEnhancingData && enhancementProgress && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-3 text-blue-600 animate-spin" />
                <span className="text-blue-800 font-medium">{enhancementProgress}</span>
              </div>
            </div>
          )}

          {/* Image Fetch Progress */}
          {isFetchingImages && imageFetchProgress && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-3 text-purple-600 animate-bounce" />
                <span className="text-purple-800 font-medium">{imageFetchProgress}</span>
              </div>
            </div>
          )}

          {/* AI Prompt Generator Section */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-200 overflow-hidden">
            <button
              type="button"
              onClick={generateAIPrompt}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Copy className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Generate AI Prompt</h3>
                  <p className="text-sm text-gray-600">Create a ready-to-use prompt for ChatGPT or Claude</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                Generate Prompt
              </div>
            </button>
          </div>

          {/* AI Prompt Modal */}
          {showPromptGenerator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Copy className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">AI Prompt Ready!</h3>
                    </div>
                    <button
                      onClick={() => setShowPromptGenerator(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Copy this prompt and paste it into ChatGPT, Claude, or any AI assistant</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 How to use:</h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Click "Copy Prompt" below</li>
                      <li>Open ChatGPT, Claude, or your preferred AI assistant</li>
                      <li>Paste the prompt and send</li>
                      <li>Wait for the AI to generate the JSON response</li>
                      <li>Copy the JSON response</li>
                      <li>Return here and use "Quick Import from JSON" to paste it</li>
                    </ol>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
                  <button
                    type="button"
                    onClick={copyPromptToClipboard}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy Prompt to Clipboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPromptGenerator(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* JSON Quick Import Section */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowJsonParser(!showJsonParser)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Import from JSON</h3>
                  <p className="text-sm text-gray-600">Parse restaurant data from JSON to auto-fill fields</p>
                </div>
              </div>
              <div className={`transform transition-transform ${showJsonParser ? 'rotate-180' : ''}`}>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {showJsonParser && (
              <div className="px-6 pb-6 space-y-4 bg-white border-t border-purple-200">
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste JSON Data
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonParseError('');
                    }}
                    placeholder={`{\n  "restaurant_name": "...",\n  "address": "...",\n  "website": "https://...",\n  "category": "Fine Dining – Italian",\n  "short_description": "...",\n  "additional_features": ["...", "..."],\n  "private_rooms": [\n    {\n      "room_name": "...",\n      "capacity": 40,\n      "setup": "...",\n      "features": ["...", "..."]\n    }\n  ]\n}`}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  />
                  {jsonParseError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">❌ {jsonParseError}</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Supported Fields:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <code className="bg-blue-100 px-1 rounded">website</code> - Website URL</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">category</code> - Restaurant category/cuisine type</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">short_description</code> - Short description field</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">additional_features</code> - Array → markdown list</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">private_rooms</code> - Array of rooms (room_name, capacity, setup, features)</li>
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={parseJsonData}
                    disabled={!jsonInput.trim()}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Parse & Import Data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJsonInput('');
                      setJsonParseError('');
                      setShowJsonParser(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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

            {/* Enhanced Image Metadata Manager */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-semibold text-gray-900">Image Metadata Manager</h3>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {formData.images?.length || 0} images
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openImageMetadataEditor()}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image with Metadata
                </button>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Manually add or edit images with full metadata (source, dimensions, website info, etc.). Use this when Outscraper fails to fetch images.
              </p>

              {/* Image List */}
              {formData.images && formData.images.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Image Preview */}
                        <div className="flex-shrink-0">
                          <img
                            src={image.url}
                            alt={image.alt || `Image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-restaurant.jpg';
                            }}
                          />
                        </div>

                        {/* Image Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate" title={image.title || 'Untitled'}>
                              {(image.title || 'Untitled').length > 50 
                                ? (image.title || 'Untitled').substring(0, 50) + '...' 
                                : (image.title || 'Untitled')
                              }
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1" title={image.alt || 'No alt text'}>
                              {(image.alt || 'No alt text').length > 50 
                                ? (image.alt || 'No alt text').substring(0, 50) + '...' 
                                : (image.alt || 'No alt text')
                              }
                            </p>
                            <div className="flex flex-wrap items-center mt-2 gap-2 text-xs text-gray-500">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                #{image.position || index + 1}
                              </span>
                              {image.dimensions && (
                                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded">
                                  {image.dimensions.width}×{image.dimensions.height}
                                </span>
                              )}
                              {image.source && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  {image.source}
                                </span>
                              )}
                            </div>
                            {image.website?.name && (
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                <span className="font-medium">Source:</span> {image.website.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions - Moved to bottom */}
                      <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => openImageMetadataEditor(index)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit metadata"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteImage(index)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          title="Delete image"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No images yet. Add images using the uploader above or with metadata below.</p>
                </div>
              )}
            </div>

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
                Additional Features
              </label>
              <textarea
                name="additional_features"
                value={formData.additional_features}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describe additional features, amenities, special services, unique offerings, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                List any special features like valet parking, AV equipment, custom menus, wine pairings, etc.
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
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Room Name
                        </label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => handlePrivateRoomChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., The Upper Room"
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
                          placeholder="e.g., 25"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setup / Event Types
                      </label>
                      <input
                        type="text"
                        value={room.setup || ''}
                        onChange={(e) => handlePrivateRoomChange(index, 'setup', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Private dinners, cocktail events, business meetings, showers"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description / Features
                      </label>
                      <textarea
                        value={room.description || ''}
                        onChange={(e) => handlePrivateRoomChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Elegant décor, natural light, custom prix fixe menus..."
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

      {/* Image Metadata Editor Modal */}
      {showImageMetadataEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingImageIndex !== null ? 'Edit Image Metadata' : 'Add New Image'}
              </h3>
              <button
                onClick={closeImageMetadataEditor}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL * <span className="text-xs text-gray-500">(ImageKit URL from uploader above)</span>
                </label>
                <input
                  type="url"
                  value={imageMetadata.url}
                  onChange={(e) => setImageMetadata(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {imageMetadata.url && (
                  <div className="mt-2">
                    <img
                      src={imageMetadata.url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-restaurant.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={imageMetadata.alt}
                    onChange={(e) => setImageMetadata(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder={`${formData.name} - Image ${(formData.images?.length || 0) + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={imageMetadata.title}
                    onChange={(e) => setImageMetadata(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={formData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <input
                    type="text"
                    value={imageMetadata.source}
                    onChange={(e) => setImageMetadata(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="Manual Upload, Google Images, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="number"
                    value={imageMetadata.position}
                    onChange={(e) => setImageMetadata(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Website Information */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Website Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={imageMetadata.website?.url || ''}
                      onChange={(e) => setImageMetadata(prev => ({
                        ...prev,
                        website: { ...prev.website, url: e.target.value }
                      }))}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={imageMetadata.website?.name || ''}
                      onChange={(e) => setImageMetadata(prev => ({
                        ...prev,
                        website: { ...prev.website, name: e.target.value }
                      }))}
                      placeholder="Example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Title
                    </label>
                    <input
                      type="text"
                      value={imageMetadata.website?.title || ''}
                      onChange={(e) => setImageMetadata(prev => ({
                        ...prev,
                        website: { ...prev.website, title: e.target.value }
                      }))}
                      placeholder="Page title from website"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Image Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={imageMetadata.dimensions?.width || ''}
                      onChange={(e) => setImageMetadata(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, width: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="1920"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={imageMetadata.dimensions?.height || ''}
                      onChange={(e) => setImageMetadata(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, height: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="1080"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeImageMetadataEditor}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveImageMetadata}
                  disabled={!imageMetadata.url || !imageMetadata.alt}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingImageIndex !== null ? 'Update Image' : 'Add Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 