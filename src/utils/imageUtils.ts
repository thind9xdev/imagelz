/*
 *   Copyright (c) 2024 thind9xdev
 *   All rights reserved.
 *   Licensed under the MIT License
 */

/**
 * Utility functions for image processing and optimization
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface ResponsiveImageSizes {
  small: string;
  medium: string;
  large: string;
  xlarge?: string;
}

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Improved URL validation with more comprehensive regex
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // First check with URL constructor
  if (!isValidUrl(url)) return false;
  
  // Then check if it looks like an image URL
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|avif)(\?.*)?$/i;
  const hasImageExtension = imageExtensions.test(url);
  
  // Also allow URLs from common image hosting services
  const imageHostingServices = [
    'imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com',
    'pixabay.com', 'freepik.com', 'shutterstock.com', 'getty',
    'amazonaws.com', 'cloudfront.net', 'cdninstagram.com',
    'fbcdn.net', 'googleusercontent.com', 'placehold'
  ];
  
  const isFromImageService = imageHostingServices.some(service => 
    url.toLowerCase().includes(service)
  );
  
  return hasImageExtension || isFromImageService;
};

/**
 * Converts HTTP URLs to HTTPS for better security
 */
export const ensureHttps = (url: string): string => {
  if (!url) return url;
  return url.replace(/^http:\/\//i, 'https://');
};

/**
 * Generates optimized image URLs with parameters
 */
export const optimizeImageUrl = (
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string => {
  if (!originalUrl || !isValidImageUrl(originalUrl)) return originalUrl;
  
  const { width, height, quality = 80, format, fit = 'cover' } = options;
  
  // For common CDN services, append optimization parameters
  const url = new URL(ensureHttps(originalUrl));
  
  // Cloudinary optimization
  if (url.hostname.includes('cloudinary.com')) {
    const parts = url.pathname.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1) {
      const transforms = [];
      if (width) transforms.push(`w_${width}`);
      if (height) transforms.push(`h_${height}`);
      if (quality) transforms.push(`q_${quality}`);
      if (format) transforms.push(`f_${format}`);
      transforms.push(`c_${fit}`);
      
      parts.splice(uploadIndex + 1, 0, transforms.join(','));
      url.pathname = parts.join('/');
    }
  }
  
  // Add generic query parameters for other services
  else {
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (quality) url.searchParams.set('q', quality.toString());
    if (format) url.searchParams.set('format', format);
  }
  
  return url.toString();
};

/**
 * Generates responsive image sizes
 */
export const generateResponsiveImages = (
  originalUrl: string,
  options: Partial<ImageOptimizationOptions> = {}
): ResponsiveImageSizes => {
  const baseOptions = { ...options };
  
  return {
    small: optimizeImageUrl(originalUrl, { ...baseOptions, width: 480 }),
    medium: optimizeImageUrl(originalUrl, { ...baseOptions, width: 768 }),
    large: optimizeImageUrl(originalUrl, { ...baseOptions, width: 1024 }),
    xlarge: optimizeImageUrl(originalUrl, { ...baseOptions, width: 1920 })
  };
};

/**
 * Creates a low-quality placeholder URL for progressive loading
 */
export const generateLowQualityPlaceholder = (
  originalUrl: string,
  options: Partial<ImageOptimizationOptions> = {}
): string => {
  return optimizeImageUrl(originalUrl, {
    ...options,
    width: 64,
    height: 64,
    quality: 10,
    format: 'jpeg'
  });
};

/**
 * Generates srcset string for responsive images
 */
export const generateSrcSet = (
  originalUrl: string,
  options: Partial<ImageOptimizationOptions> = {}
): string => {
  const sizes = generateResponsiveImages(originalUrl, options);
  
  return [
    `${sizes.small} 480w`,
    `${sizes.medium} 768w`,
    `${sizes.large} 1024w`,
    `${sizes.xlarge} 1920w`
  ].join(', ');
};

/**
 * Detects the best image format support
 */
export const detectImageFormatSupport = (): Promise<{
  webp: boolean;
  avif: boolean;
}> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // Test AVIF support
    const avifImg = new Image();
    avifImg.onload = avifImg.onerror = () => {
      resolve({
        webp: webpSupport,
        avif: avifImg.width === 1
      });
    };
    avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Preloads an image
 */
export const preloadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};