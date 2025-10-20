'use client';

import { useState, useRef, useEffect } from 'react';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { imagekitConfig, validateImageKitConfig } from '@/lib/imagekit-config';

interface ImageKitUploadProps {
  onImageUpload: (imageData: { url: string; fileId: string; name: string }) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  folder?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImageKitUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  folder = '/restaurants',
  className = '',
  disabled = false,
}: ImageKitUploadProps) {
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
    
    onImageUpload({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  };

  const handleUploadError = (error: any) => {
    setUploading(false);
    setError('Upload failed. Please try again.');
  };

  const handleUploadStart = () => {
    setUploading(true);
    setError(null);
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const triggerUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Restaurant Image
        </label>
        {currentImage && onImageRemove && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-red-600 hover:text-red-800 text-sm flex items-center"
            disabled={disabled}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </button>
        )}
      </div>

      <IKContext
        publicKey={imagekitConfig.publicKey}
        urlEndpoint={imagekitConfig.urlEndpoint}
        transformationPosition={imagekitConfig.transformationPosition}
        authenticationEndpoint={imagekitConfig.authenticationEndpoint}
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Restaurant image"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                // Silently handle image load errors (e.g., external URLs that may be blocked)
                e.currentTarget.style.display = 'none';
              }}
            />
            {!disabled && (
              <button
                type="button"
                onClick={triggerUpload}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-lg"
              >
                <Upload className="h-6 w-6 mr-2" />
                Replace Image
              </button>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
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
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
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
