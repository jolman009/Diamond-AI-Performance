import { Cloudinary } from 'cloudinary-core';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '';
const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET || '';

if (!cloudName) {
  console.warn('Cloudinary cloud name not found. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.');
}

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud_name: cloudName,
  secure: true,
});

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName,
  apiKey,
  apiSecret,
  uploadPreset: 'diamond-ai', // You'll need to create this in Cloudinary dashboard
};

// Helper function to generate signed upload parameters
export const getCloudinarySignature = async (
  paramsToSign: Record<string, any>
): Promise<string> => {
  // In production, this should call your backend to generate the signature
  // For now, we'll handle unsigned uploads with an upload preset
  console.warn('Cloudinary signature generation should be handled server-side in production');
  return '';
};

// Upload an image or video to Cloudinary
export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' = 'image',
  folder: string = 'diamond-ai'
): Promise<{
  url: string;
  publicId: string;
  thumbnailUrl?: string;
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder);
  formData.append('resource_type', resourceType);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: resourceType === 'video' ? data.eager?.[0]?.secure_url : data.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Generate thumbnail URL for a video
export const getVideoThumbnail = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width: 400, height: 300, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
};
