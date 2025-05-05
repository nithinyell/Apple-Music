import React, { useState, useRef } from 'react';
import '../styles/AlbumCard.css';
import '../styles/CachedImage.css';
import useImageCache from '../hooks/useImageCache';
import ImageFallback from './ImageFallback';

const AlbumCard = ({ 
  image, 
  title, 
  artist, 
  album, 
  genres, 
  trackCount, 
  duration, 
  url, 
  releaseDate, 
  description,
  contentAdvisoryRating,
  copyright,
  artistUrl,
  previewUrl
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);
  const { getCachedImage } = useImageCache();
  
  // Format duration from milliseconds to mm:ss
  const formatDuration = (ms) => {
    if (!ms) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format release date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle image load completion
  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true);
    // Use a small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
  }, []);
  
  // Handle image load error
  const handleImageError = React.useCallback(() => {
    console.warn(`Failed to load image for "${title || 'Unknown'}" by ${artist || 'Unknown Artist'}`);
    // Stop the loading spinner and show a fallback
    setIsLoading(false);
    setImageLoaded(true);
  }, [title, artist]);

  // Load image from cache when component mounts
  React.useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    setIsLoading(true);
    setImageLoaded(false);

    // Check if we already have the image in memory (for fast transitions)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
      handleImageLoad();
      return;
    }
    
    // Set a timeout to stop loading after 8 seconds regardless
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn(`Image loading timed out for "${title || 'Unknown'}" by ${artist || 'Unknown Artist'}`);
        setIsLoading(false);
        setImageLoaded(true);
      }
    }, 8000);

    const loadImage = async () => {
      if (!image) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get the image from cache
        const cachedSrc = await getCachedImage(image);
        
        if (isMounted) {
          setImageSrc(cachedSrc);
          
          // If the image is already in browser cache, it might load instantly
          if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
            handleImageLoad();
          }
        }
      } catch (error) {
        console.error('Error loading cached image:', error);
        
        if (isMounted) {
          // Fall back to original source on error
          setImageSrc(image);
          
          // If we had an error, stop the loading spinner after a short delay
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
              setImageLoaded(true);
            }
          }, 500);
        }
      }
    };

    // Use a try-catch block to handle any potential errors during image loading
    try {
      loadImage();
    } catch (err) {
      console.error('Error in image loading process:', err);
      if (isMounted) {
        setImageSrc(image);
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [image, getCachedImage, title, artist]); // Removed isLoading from dependencies

  return (
    <div 
      className={`album-card ${showDetails ? 'expanded' : ''}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="album-image-container">
        {isLoading && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        {image ? (
          <ImageFallback 
            ref={imgRef}
            src={imageSrc || image} 
            alt={title} 
            className={`album-image ${imageLoaded ? 'fade-in' : ''}`}
            style={{ opacity: isLoading ? 0 : 1 }}
            onLoad={handleImageLoad}
            fallbackSrc="https://via.placeholder.com/300x300?text=Music"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="album-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="album-link"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="album-link-icon">▶</span>
          </a>
        )}
      </div>
      <div className="album-info">
        <h3 className="album-title">{title || 'Unknown Title'}</h3>
        <p className="album-artist">
          {artistUrl ? (
            <a 
              href={artistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {artist || 'Unknown Artist'}
            </a>
          ) : (
            artist || 'Unknown Artist'
          )}
        </p>
        
        {showDetails && (
          <div className="album-details">
            {album && <p className="album-detail"><span>Album:</span> {album}</p>}
            {genres && <p className="album-detail"><span>Genres:</span> {genres}</p>}
            {trackCount && <p className="album-detail"><span>Tracks:</span> {trackCount}</p>}
            {duration && <p className="album-detail"><span>Duration:</span> {formatDuration(duration)}</p>}
            {releaseDate && <p className="album-detail"><span>Released:</span> {formatDate(releaseDate)}</p>}
            {contentAdvisoryRating && <p className="album-detail"><span>Rating:</span> {contentAdvisoryRating}</p>}
            {copyright && <p className="album-detail"><span>Copyright:</span> {copyright}</p>}
            
            {previewUrl && (
              <div className="album-preview">
                <span>Preview:</span>
                <audio controls src={previewUrl} className="audio-preview" onClick={(e) => e.stopPropagation()}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {description && (
              <div className="album-description">
                <p>{description}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="album-card-footer">
          <span className="details-toggle">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;