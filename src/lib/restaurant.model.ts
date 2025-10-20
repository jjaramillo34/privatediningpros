import { Schema, Document, models, model } from 'mongoose';

export interface IPrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
  description?: string;
}

export interface IRestaurantImage {
  url: string;
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

export interface IRestaurant extends Document {
  name: string;
  address: string;
  full_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  neighborhood?: string; // Neighborhood/area within the city
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  description?: string; // Full detailed description
  short_description?: string; // Brief description for cards and listings
  additional_features?: string; // Additional features and amenities description
  image?: string;
  images?: IRestaurantImage[]; // Array of multiple images with metadata
  rating?: number;
  reviews?: number;
  working_hours?: Record<string, string>;
  category?: string;
  price_range?: string;
  privateRooms: IPrivateRoom[];
  // Outscraper API fields
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
  // Approval and submission tracking
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string; // User ID who submitted
  approvedBy?: string; // Admin ID who approved/rejected
  approvedAt?: Date;
  rejectionReason?: string;
  // Featured/Curated content
  featured?: boolean; // Admin-curated restaurants for featured display
  featuredBy?: string; // Admin ID who featured this restaurant
  featuredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const PrivateRoomSchema = new Schema<IPrivateRoom>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  setup: { type: String },
  description: { type: String },
});

const RestaurantImageSchema = new Schema<IRestaurantImage>({
  url: { type: String, required: true },
  alt: { type: String },
  title: { type: String },
  source: { type: String },
  website: {
    url: { type: String },
    title: { type: String },
    name: { type: String }
  },
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  position: { type: Number }
});

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  full_address: { type: String },
  city: { type: String },
  state: { type: String },
  postal_code: { type: String },
  country: { type: String },
  neighborhood: { type: String }, // Neighborhood/area within the city
  latitude: { type: Number },
  longitude: { type: Number },
  phone: { type: String },
  website: { type: String },
  description: { type: String }, // Full detailed description
  short_description: { type: String }, // Brief description for cards and listings
  additional_features: { type: String }, // Additional features and amenities description
  image: { type: String },
  images: { type: [RestaurantImageSchema] }, // Array of multiple images with metadata
  rating: { type: Number, min: 0, max: 5 },
  reviews: { type: Number },
  working_hours: { type: Schema.Types.Mixed },
  category: { type: String },
  price_range: { type: String },
  privateRooms: { type: [PrivateRoomSchema], default: [] },
  // Outscraper API fields
  place_id: { type: String },
  google_id: { type: String },
  business_status: { type: String },
  verified: { type: Boolean },
  logo: { type: String },
  photo: { type: String },
  street_view: { type: String },
  time_zone: { type: String },
  plus_code: { type: String },
  h3: { type: String },
  // Service and amenity data (stored as JSON strings)
  service_options: { type: String },
  highlights: { type: String },
  popular_for: { type: String },
  accessibility: { type: String },
  offerings: { type: String },
  dining_options: { type: String },
  amenities: { type: String },
  atmosphere: { type: String },
  crowd: { type: String },
  planning: { type: String },
  payments: { type: String },
  parking: { type: String },
  // Additional data
  typical_time_spent: { type: String },
  subtypes: { type: String },
  reviews_tags: { type: String },
  photos_count: { type: Number },
  reviews_per_score: { type: String },
  reservation_links: { type: String },
  booking_appointment_link: { type: String },
  menu_link: { type: String },
  order_links: { type: String },
  // Approval and submission tracking
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' // New restaurants are pending by default
  },
  submittedBy: { type: String }, // Email or User ID
  approvedBy: { type: String }, // Email or User ID
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  // Featured/Curated content
  featured: { type: Boolean, default: false },
  featuredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  featuredAt: { type: Date },
}, {
  timestamps: true
});

// Add indexes for better query performance
RestaurantSchema.index({ status: 1, createdAt: -1 }); // For status filtering + sorting
RestaurantSchema.index({ featured: 1 }); // For featured restaurants
RestaurantSchema.index({ name: 1 }); // For name searches and sorting
RestaurantSchema.index({ neighborhood: 1 }); // For location filtering
RestaurantSchema.index({ category: 1 }); // For category filtering
RestaurantSchema.index({ rating: -1 }); // For rating sorting
RestaurantSchema.index({ place_id: 1 }); // For unique identification
RestaurantSchema.index({ google_id: 1 }); // For Google Maps integration

export default models.Restaurant || model<IRestaurant>('Restaurant', RestaurantSchema); 