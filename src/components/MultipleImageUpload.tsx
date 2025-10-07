'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Plus } from 'lucide-react';

interface ImageData {
  url: string;
  fileId: string;
  name: string;
  alt?: string;
  title?: string;
}

interface MultipleImageUploadProps {
  onImagesChange: (images: ImageData[]) => void;
  currentImages: ImageData[];
  folder?: string;
  className?: string;
  disabled?: boolean;
  maxImages?: number;
}

export default function MultipleImageUpload({
  onImagesChange,
  currentImages,
  folder = '/restaurants',
  className = '',
  disabled = false,
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (currentImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select valid image files only');
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('File size must be less than 10MB each');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          return {
            url: result.data.url,
            fileId: result.data.fileId,
            name: result.data.name,
            alt: file.name.split('.')[0], // Use filename as alt text
            title: file.name.split('.')[0],
          };
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onImagesChange([...currentImages, ...uploadedImages]);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleUpdateImageMetadata = (index: number, field: 'alt' | 'title', value: string) => {
    const newImages = [...currentImages];
    newImages[index] = { ...newImages[index], [field]: value };
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Restaurant Images ({currentImages.length}/{maxImages})
        </label>
        {currentImages.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Images
          </button>
        )}
      </div>

      {/* Upload Area */}
      {currentImages.length === 0 && (
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          )}
        </div>
      )}

      {/* Images Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.alt || `Restaurant image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              
              {/* Remove Button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Metadata Inputs */}
              <div className="mt-2 space-y-1">
                <input
                  type="text"
                  placeholder="Alt text"
                  value={image.alt || ''}
                  onChange={(e) => handleUpdateImageMetadata(index, 'alt', e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={disabled}
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={image.title || ''}
                  onChange={(e) => handleUpdateImageMetadata(index, 'title', e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={disabled}
                />
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {currentImages.length < maxImages && (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
              ) : (
                <Plus className="h-6 w-6 text-gray-400 mx-auto" />
              )}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <X className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
