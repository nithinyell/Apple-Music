import React, { useState, useEffect, forwardRef } from 'react';

/**
 * ImageFallback component that provides fallback for failed image loads
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Primary image source
 * @param {string} props.fallbackSrc - Fallback image source to use if primary fails
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS class for the image
 */
const ImageFallback = forwardRef(({ 
  src, 
  fallbackSrc = 'https://via.placeholder.com/300x300?text=Music', 
  alt = '', 
  className = '',
  onLoad,
  ...props 
}, ref) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  
  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);
  
  const handleError = () => {
    console.warn(`Image failed to load: ${imgSrc}`);
    if (imgSrc !== fallbackSrc) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
  };
  
  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };
  
  return (
    <img
      ref={ref}
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
});

// Add display name for better debugging
ImageFallback.displayName = 'ImageFallback';

export default ImageFallback;