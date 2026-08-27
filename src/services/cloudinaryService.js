/**
 * Cloudinary Direct Upload Service
 * Provides helper functions to upload images and assets directly to Cloudinary CDN
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dughdt8sf';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'qubink_uploads';

/**
 * Uploads a File or Blob directly to Cloudinary via unsigned upload preset
 * @param {File|Blob|string} file - The file object or base64 data URI to upload
 * @returns {Promise<{ url: string, publicId: string, secureUrl: string, width: number, height: number }>}
 */
export async function uploadToCloudinary(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return {
      url: data.url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}
