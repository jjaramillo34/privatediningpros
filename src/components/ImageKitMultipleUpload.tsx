'use client';

import { useState, useRef, useEffect } from 'react';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { Upload, X, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { imagekitConfig, validateImageKitConfig } from '@/lib/imagekit-config';

interface ImageData {
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

interface ImageKitMultipleUploadProps {
  onImagesChange: (images: ImageData[]) => void;
  currentImages: ImageData[];
  folder?: string;
  className?: string;
  disabled?: boolean;
  maxImages?: number;
}

export default function ImageKitMultipleUpload({
  onImagesChange,
  currentImages,
  folder = '/restaurants',
  className = '',
  disabled = false,
  maxImages = 10,
}: ImageKitMultipleUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<any>(null);

  // Validate ImageKit configuration
  useEffect(() => {
    validateImageKitConfig();
  }, []);

  const handleUploadSuccess = (result: any) => {
    setUploading(false);
    setError(null);
    
    const newImage: ImageData = {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      alt: result.name.split('.')[0], // Use filename as alt text
      title: result.name.split('.')[0],
      position: currentImages.length + 1,
    };

    onImagesChange([...currentImages, newImage]);
  };

  const handleUploadError = (error: any) => {
    setUploading(false);
    setError('Upload failed. Please try again.');
  };

  const handleUploadStart = () => {
    if (currentImages.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    setUploading(true);
    setError(null);
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

  const triggerUpload = () => {
    if (uploadRef.current && currentImages.length < maxImages) {
      uploadRef.current.click();
    }
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
            onClick={triggerUpload}
            disabled={disabled || uploading}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Images
          </button>
        )}
      </div>

      <IKContext
        publicKey={imagekitConfig.publicKey}
        urlEndpoint={imagekitConfig.urlEndpoint}
        transformationPosition={imagekitConfig.transformationPosition}
        authenticationEndpoint={imagekitConfig.authenticationEndpoint}
      >
        {/* Upload Area */}
        {currentImages.length === 0 && (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => !disabled && triggerUpload()}
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
                  onError={(e) => {
                    // Silently handle image load errors (e.g., external URLs that may be blocked)
                    e.currentTarget.style.display = 'none';
                  }}
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
                onClick={() => !disabled && triggerUpload()}
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

        <IKUpload
          ref={uploadRef}
          fileName="restaurant-image"
          folder={folder}
          onUploadStart={handleUploadStart}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          className="hidden"
          disabled={disabled}
        />
      </IKContext>

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <X className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
