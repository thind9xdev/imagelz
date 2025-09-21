/**
 * Advanced ImageLazy Component with Progressive Loading and Image Processing
 * Copyright (c) 2024 thind9xdev
 * Licensed under the MIT License
 */

import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import React, {
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

import useImageBroken, { UseImageBrokenOptions } from "./hooks/useImageBroken";
import useProgressiveImage, { UseProgressiveImageOptions } from "./hooks/useProgressiveImage";
import {
  ensureHttps,
  isValidImageUrl,
  optimizeImageUrl,
  generateSrcSet,
  generateLowQualityPlaceholder,
  ImageOptimizationOptions,
} from "./utils/imageUtils";

export interface ImageLazyProps {
  /** Main image URL */
  imgUrl: string;
  /** Default/fallback image URL */
  imgUrlDefault?: string;
  /** Image width */
  width?: string | number;
  /** Image height */
  height?: string | number;
  /** CSS class name */
  className?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Element ID */
  id?: string;
  /** Custom inline styles */
  style?: CSSProperties;
  /** Loading behavior */
  loading?: "lazy" | "eager";
  /** Cross-origin policy */
  crossOrigin?: "anonymous" | "use-credentials" | "";
  /** Referrer policy */
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "unsafe-url";
  
  // Event handlers
  onClick?: MouseEventHandler<HTMLImageElement>;
  onKeyDown?: KeyboardEventHandler<HTMLImageElement>;
  onMouseDown?: MouseEventHandler<HTMLImageElement>;
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
  onMouseUp?: MouseEventHandler<HTMLImageElement>;
  onLoad?: MouseEventHandler<HTMLImageElement>;
  onError?: MouseEventHandler<HTMLImageElement>;
  onKeyPress?: () => void;

  // Advanced features
  /** Enable progressive loading with blur-to-sharp effect */
  progressive?: boolean;
  /** Progressive loading options */
  progressiveOptions?: UseProgressiveImageOptions;
  /** Image optimization options */
  optimizationOptions?: ImageOptimizationOptions;
  /** Enable responsive images with srcset */
  responsive?: boolean;
  /** Custom sizes attribute for responsive images */
  sizes?: string;
  /** Loading state indicator */
  isLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
  /** Retry configuration for failed loads */
  retryOptions?: UseImageBrokenOptions;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Skeleton color */
  skeletonColor?: string;
}

const ImageLazy = React.memo<ImageLazyProps>(function ImageLazy({
  alt = "",
  onClick,
  style = {},
  height,
  onKeyDown,
  id,
  crossOrigin,
  loading = "lazy",
  imgUrl,
  imgUrlDefault = "https://placehold.co/280x200",
  width,
  className = "",
  isLoading = false,
  referrerPolicy,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onLoad,
  onError,
  progressive = false,
  progressiveOptions = {},
  optimizationOptions = {},
  responsive = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  loadingComponent,
  errorComponent,
  retryOptions = {},
  showSkeleton = true,
  skeletonColor = "#f0f0f0"
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Optimize and validate URLs
  const optimizedUrl = useMemo(() => {
    if (!imgUrl || !isValidImageUrl(imgUrl)) return imgUrlDefault;
    return optimizeImageUrl(ensureHttps(imgUrl), optimizationOptions);
  }, [imgUrl, imgUrlDefault, optimizationOptions]);

  const optimizedFallbackUrl = useMemo(() => {
    return optimizeImageUrl(ensureHttps(imgUrlDefault), optimizationOptions);
  }, [imgUrlDefault, optimizationOptions]);

  // Use the image broken detection hook
  const { isValid: isUrlValid, isLoading: urlIsLoading, retries } = useImageBroken(
    optimizedUrl,
    retryOptions
  );

  // Generate progressive loading URLs
  const lowQualityUrl = useMemo(() => {
    if (!progressive || !optimizedUrl) return undefined;
    return generateLowQualityPlaceholder(optimizedUrl, optimizationOptions);
  }, [progressive, optimizedUrl, optimizationOptions]);

  // Use progressive image hook if enabled
  const progressiveImage = useProgressiveImage(
    optimizedUrl,
    {
      ...progressiveOptions,
      lowQualityUrl,
    }
  );

  // Generate responsive srcset
  const srcSet = useMemo(() => {
    if (!responsive || !optimizedUrl) return undefined;
    return generateSrcSet(optimizedUrl, optimizationOptions);
  }, [responsive, optimizedUrl, optimizationOptions]);

  // Intersection Observer for lazy loading
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
        setShouldLoad(true);
        if (observerRef.current && imgRef.current) {
          observerRef.current.unobserve(imgRef.current);
        }
      }
    });
  }, [hasIntersected]);

  useEffect(() => {
    if (loading === "eager") {
      setShouldLoad(true);
      setHasIntersected(true);
      return;
    }

    const currentRef = imgRef.current;
    if (!currentRef) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "50px",
      threshold: 0.1,
    });

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, handleIntersection]);

  // Determine what to show
  const shouldShowSkeleton = showSkeleton && (isLoading || urlIsLoading || !shouldLoad);
  const shouldShowError = shouldLoad && isUrlValid === false && retries >= (retryOptions.retryCount || 2);
  const shouldShowImage = shouldLoad && !shouldShowError;

  // Determine final image source
  const finalImageSrc = useMemo(() => {
    if (progressive && progressiveImage.src) {
      return progressiveImage.src;
    }
    return isUrlValid ? optimizedUrl : optimizedFallbackUrl;
  }, [progressive, progressiveImage.src, isUrlValid, optimizedUrl, optimizedFallbackUrl]);

  // Combine styles
  const combinedStyle = useMemo(() => ({
    ...style,
    ...(progressive ? progressiveImage.style : {}),
  }), [style, progressive, progressiveImage.style]);

  // Skeleton component
  const skeleton = (
    <div 
      ref={imgRef}
      className={`${className} image-skeleton`}
      style={{
        ...combinedStyle,
        width,
        height,
        backgroundColor: skeletonColor,
        backgroundImage: `linear-gradient(90deg, ${skeletonColor} 25%, transparent 50%, ${skeletonColor} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'imageSkeletonLoading 1.5s infinite',
        display: 'inline-block',
      }}
    >
      {loadingComponent}
    </div>
  );

  // Error component
  const errorDisplay = (
    <div
      ref={imgRef}
      className={`${className} image-error`}
      style={{
        ...combinedStyle,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#999',
        fontSize: '14px',
        border: '1px solid #ddd',
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="img"
      aria-label={alt || "Failed to load image"}
    >
      {errorComponent || (
        <span>
          ⚠️ {retries > 0 ? `Failed after ${retries} retries` : 'Image failed to load'}
        </span>
      )}
    </div>
  );

  // Main image component
  const imageElement = (
    <picture>
      {/* WebP source for better compression */}
      {responsive && srcSet && (
        <source
          srcSet={srcSet.replace(/\.(jpg|jpeg|png)/gi, '.webp')}
          sizes={sizes}
          type="image/webp"
        />
      )}
      
      {/* Original format source */}
      {responsive && srcSet && (
        <source
          srcSet={srcSet}
          sizes={sizes}
        />
      )}
      
      <img
        ref={imgRef}
        src={finalImageSrc}
        alt={alt}
        className={`${className} lazyload`}
        style={combinedStyle}
        width={width}
        height={height}
        loading={loading}
        crossOrigin={crossOrigin}
        referrerPolicy={referrerPolicy}
        id={id}
        data-src={finalImageSrc}
        srcSet={responsive ? srcSet : undefined}
        sizes={responsive ? sizes : undefined}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onLoad={onLoad}
        onError={onError}
        role="img"
        tabIndex={onClick || onKeyDown ? 0 : undefined}
      />
    </picture>
  );

  // Render logic
  if (shouldShowSkeleton) {
    return skeleton;
  }

  if (shouldShowError) {
    return errorDisplay;
  }

  if (shouldShowImage) {
    return imageElement;
  }

  return skeleton;
});

export default ImageLazy;