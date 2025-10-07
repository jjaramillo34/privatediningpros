'use client';

import ImageKitUpload from '@/components/ImageKitUpload';
import ImageKitMultipleUpload from '@/components/ImageKitMultipleUpload';

interface PrivateDiningFieldsProps {
  formData: {
    private_rooms: string;
    capacity: string;
    special_features: string;
    description: string;
    image: string;
    images: any[];
    hours: string;
    best_for: string;
    atmosphere: string;
    dress_code: string;
    parking: string;
    accessibility: string;
    notes: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUpload: (imageData: { url: string; fileId: string; name: string }) => void;
  onImagesChange: (images: any[]) => void;
  readOnly?: boolean;
}

export default function PrivateDiningFields({ 
  formData, 
  handleChange, 
  onImageUpload, 
  onImagesChange,
  readOnly = false 
}: PrivateDiningFieldsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Private Dining Details</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Private Rooms</label>
            <input
              type="number"
              name="private_rooms"
              value={formData.private_rooms}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Features</label>
          <textarea
            name="special_features"
            value={formData.special_features}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AV equipment, private bar, outdoor terrace"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Description (Markdown)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Detailed markdown description of the private dining experience, amenities, ambiance, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use Markdown formatting for rich text (headings, lists, links, etc.)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <ImageKitUpload
            currentImage={formData.image}
            onImageUpload={onImageUpload}
            folder="/restaurants"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
          <ImageKitMultipleUpload
            currentImages={formData.images}
            onImagesChange={onImagesChange}
            folder="/restaurants"
            maxImages={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours (JSON format)</label>
          <textarea
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            rows={8}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            placeholder={'{\n  "Monday": "11:00 AM - 10:00 PM",\n  "Tuesday": "11:00 AM - 10:00 PM"\n}'}
            readOnly={readOnly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Best For</label>
            <input
              type="text"
              name="best_for"
              value={formData.best_for}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Corporate events, Weddings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Atmosphere</label>
            <input
              type="text"
              name="atmosphere"
              value={formData.atmosphere}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                readOnly ? 'bg-gray-100' : ''
              }`}
              placeholder="e.g., Elegant, Modern, Intimate"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dress Code</label>
            <input
              type="text"
              name="dress_code"
              value={formData.dress_code}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Business Casual, Formal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
            <input
              type="text"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                readOnly ? 'bg-gray-100' : ''
              }`}
              placeholder="e.g., Valet, Street parking"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Accessibility</label>
          <input
            type="text"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            placeholder="e.g., Wheelchair accessible"
            readOnly={readOnly}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional information or special requirements"
          />
        </div>
      </div>
    </div>
  );
}

