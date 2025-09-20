/*
 *   Copyright (c) 2024 thind9xdev
 *   All rights reserved.
 *   Licensed under the MIT License
 */

/**
 * Hook for progressive image loading with blur-to-sharp effect
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseProgressiveImageOptions {
  lowQualityUrl?: string;
  blurAmount?: number;
  transitionDuration?: number;
}

export interface ProgressiveImageState {
  src: string;
  isLoaded: boolean;
  isLoading: boolean;
  shouldShowLowQuality: boolean;
  style: React.CSSProperties;
}

const useProgressiveImage = (
  highQualityUrl: string,
  options: UseProgressiveImageOptions = {}
): ProgressiveImageState => {
  const {
    lowQualityUrl,
    blurAmount = 10,
    transitionDuration = 300
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLowQuality, setShouldShowLowQuality] = useState(!!lowQualityUrl);

  const loadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (!highQualityUrl) return;

    setIsLoading(true);
    setIsLoaded(false);

    const loadSequence = async () => {
      try {
        // If we have a low quality URL, load it first
        if (lowQualityUrl) {
          await loadImage(lowQualityUrl);
        }

        // Then load the high quality image
        await loadImage(highQualityUrl);
        
        setIsLoaded(true);
        setShouldShowLowQuality(false);
      } catch (error) {
        console.warn('Failed to load image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSequence();
  }, [highQualityUrl, lowQualityUrl, loadImage]);

  const style: React.CSSProperties = {
    transition: `filter ${transitionDuration}ms ease-out, opacity ${transitionDuration}ms ease-out`,
    filter: shouldShowLowQuality && !isLoaded ? `blur(${blurAmount}px)` : 'none',
    opacity: isLoading && !lowQualityUrl ? 0.7 : 1,
  };

  return {
    src: isLoaded ? highQualityUrl : (lowQualityUrl || highQualityUrl),
    isLoaded,
    isLoading,
    shouldShowLowQuality,
    style
  };
};

export default useProgressiveImage;