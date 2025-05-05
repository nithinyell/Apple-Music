import React, { useState, useEffect } from 'react';
import useImageCache from '../hooks/useImageCache';

/**
 * CachedImage component that loads images from cache when available
 * Falls back to original URL if cache fails
 */
const CachedImage = ({ src, alt, className, onLoad, ...props }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { getCachedImage } = useImageCache();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadImage = async () => {
      if (!src) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get the image from cache
        const cachedSrc = await getCachedImage(src);
        
        if (isMounted) {
          setImageSrc(cachedSrc);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading cached image:', error);
        
        if (isMounted) {
          // Fall back to original source on error
          setImageSrc(src);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, getCachedImage]);

  const handleImageLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <>
      {isLoading && (
        <div className={`image-placeholder ${className || ''}`}>
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={imageSrc || src}
        alt={alt || ''}
        className={`${className || ''} ${isLoading ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
};

export default CachedImage;