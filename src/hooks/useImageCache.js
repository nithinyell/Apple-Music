import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for caching images based on URL
 * Uses localStorage to persist cache between sessions
 */
const useImageCache = () => {
  // In-memory cache for faster access during the session
  const memoryCache = useRef(new Map());
  
  // Initialize the cache from localStorage
  const [imageCache, setImageCache] = useState(() => {
    try {
      const cachedData = localStorage.getItem('imageCache');
      return cachedData ? JSON.parse(cachedData) : {};
    } catch (error) {
      console.error('Error loading image cache from localStorage:', error);
      return {};
    }
  });

  // Preload images from cache into memory for faster access
  useEffect(() => {
    // Load cached images into memory cache
    Object.entries(imageCache).forEach(([url, dataUrl]) => {
      if (!memoryCache.current.has(url)) {
        memoryCache.current.set(url, dataUrl);
      }
    });
  }, []);

  // Save cache to localStorage with debounce to prevent excessive writes
  useEffect(() => {
    const saveToStorage = () => {
      try {
        localStorage.setItem('imageCache', JSON.stringify(imageCache));
      } catch (error) {
        console.error('Error saving image cache to localStorage:', error);
        
        // If storage is full, try to remove oldest entries
        if (error.name === 'QuotaExceededError') {
          const entries = Object.entries(imageCache);
          if (entries.length > 10) {
            // Remove 20% of oldest entries
            const entriesToRemove = Math.floor(entries.length * 0.2);
            const newCache = Object.fromEntries(entries.slice(entriesToRemove));
            setImageCache(newCache);
          }
        }
      }
    };

    // Use a timeout to debounce writes
    const timeoutId = setTimeout(saveToStorage, 1000);
    return () => clearTimeout(timeoutId);
  }, [imageCache]);

  /**
   * Get an image from cache or fetch it and store in cache
   * @param {string} url - The image URL
   * @returns {Promise<string>} - A promise that resolves to the cached data URL
   */
  const getCachedImage = useCallback(async (url) => {
    // First check memory cache (fastest)
    if (memoryCache.current.has(url)) {
      return memoryCache.current.get(url);
    }
    
    // Then check localStorage cache
    if (imageCache[url]) {
      // Store in memory cache for faster future access
      memoryCache.current.set(url, imageCache[url]);
      return imageCache[url];
    }

    // Otherwise fetch the image and cache it
    try {
      // Fetch the image with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, { 
        mode: 'cors',
        credentials: 'omit',
        cache: 'force-cache', // Use browser cache when available
        signal: controller.signal,
        headers: {
          'Accept': 'image/*'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      // Clone the response before reading it as blob
      const responseClone = response.clone();
      let blob;
      
      try {
        blob = await response.blob();
      } catch (blobError) {
        console.warn('Error reading response as blob, trying with cloned response', blobError);
        blob = await responseClone.blob();
      }
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64data = reader.result;
            
            // Update memory cache immediately
            memoryCache.current.set(url, base64data);
            
            // Update localStorage cache
            setImageCache(prevCache => ({
              ...prevCache,
              [url]: base64data
            }));
            
            resolve(base64data);
          } catch (readerError) {
            console.error('Error processing FileReader result:', readerError);
            resolve(url); // Fall back to original URL
          }
        };
        reader.onerror = (fileReaderError) => {
          console.error('FileReader error:', fileReaderError);
          reject(fileReaderError);
        };
        
        try {
          reader.readAsDataURL(blob);
        } catch (readError) {
          console.error('Error reading blob as data URL:', readError);
          reject(readError);
        }
      });
    } catch (error) {
      console.error(`Error caching image from ${url}:`, error);
      return url; // Fall back to original URL on error
    }
  }, [imageCache]);

  /**
   * Clear the entire image cache
   */
  const clearImageCache = useCallback(() => {
    setImageCache({});
    memoryCache.current.clear();
    try {
      localStorage.removeItem('imageCache');
    } catch (error) {
      console.error('Error clearing image cache from localStorage:', error);
    }
  }, []);

  /**
   * Remove a specific image from cache
   * @param {string} url - The image URL to remove from cache
   */
  const removeFromCache = useCallback((url) => {
    memoryCache.current.delete(url);
    setImageCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[url];
      return newCache;
    });
  }, []);

  /**
   * Get the current cache size in MB
   * @returns {number} - Cache size in MB
   */
  const getCacheSize = useCallback(() => {
    try {
      const cacheStr = localStorage.getItem('imageCache') || '{}';
      return (cacheStr.length * 2) / (1024 * 1024); // Approximate size in MB
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }, []);

  /**
   * Preload a batch of images into cache
   * @param {string[]} urls - Array of image URLs to preload
   */
  const preloadImages = useCallback(async (urls) => {
    if (!Array.isArray(urls) || urls.length === 0) return;
    
    // Filter out already cached images
    const uncachedUrls = urls.filter(url => 
      !memoryCache.current.has(url) && !imageCache[url]
    );
    
    // Preload in batches to avoid overwhelming the browser
    const batchSize = 3;
    for (let i = 0; i < uncachedUrls.length; i += batchSize) {
      const batch = uncachedUrls.slice(i, i + batchSize);
      await Promise.all(batch.map(url => getCachedImage(url).catch(() => {})));
    }
  }, [imageCache, getCachedImage]);

  return {
    getCachedImage,
    clearImageCache,
    removeFromCache,
    getCacheSize,
    preloadImages,
    cacheEntries: Object.keys(imageCache).length
  };
};

export default useImageCache;