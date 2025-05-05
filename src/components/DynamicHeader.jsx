import React, { useState, useEffect } from 'react';
import { APPLE_MUSIC_COUNTRIES } from '../networking/api';

/**
 * DynamicHeader component
 * Collapses to a smaller size when scrolling down
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {string} props.country - Country code
 * @param {string} props.lastUpdated - Last updated timestamp
 */
const DynamicHeader = ({ title, country, lastUpdated }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll events
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Determine if we should collapse or expand
    if (currentScrollY > 100 && currentScrollY > lastScrollY) {
      setIsCollapsed(true);
    } else if (currentScrollY < 100 || currentScrollY < lastScrollY) {
      setIsCollapsed(false);
    }
    
    setLastScrollY(currentScrollY);
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Format the date in a shorter way for mobile
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if we're in PWA mode
  const isPwa = typeof window !== 'undefined' && 
                (window.navigator.standalone || 
                 window.matchMedia('(display-mode: standalone)').matches);
  
  // Styles for the header
  const headerStyle = {
    position: isPwa ? 'fixed' : 'sticky', // Only use fixed in PWA mode
    top: 0,
    left: isPwa ? 0 : 'auto',
    right: isPwa ? 0 : 'auto',
    zIndex: 100,
    transition: 'all 0.3s ease',
    background: isCollapsed 
      ? 'rgba(0, 0, 0, 0.85)' 
      : 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)',
    backdropFilter: isCollapsed ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: isCollapsed ? 'blur(10px)' : 'none',
    height: isCollapsed ? '44px' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isCollapsed ? '0 16px' : '10px 16px',
    paddingTop: isPwa 
      ? (isCollapsed 
          ? 'max(var(--sat, 0px), env(safe-area-inset-top, 0px))' 
          : 'calc(10px + max(var(--sat, 0px), env(safe-area-inset-top, 0px)))') 
      : (isCollapsed ? '0' : '10px'), // Regular padding for web app
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: isPwa 
      ? (isCollapsed 
          ? 'calc(44px + max(var(--sat, 0px), env(safe-area-inset-top, 0px)))' 
          : 'calc(70px + max(var(--sat, 0px), env(safe-area-inset-top, 0px)))') 
      : (isCollapsed ? '44px' : '70px') // Regular height for web app
  };

  // Container for title and badge to center them together
  const titleContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  };

  // Styles for the title
  const titleStyle = {
    margin: 0,
    fontSize: isCollapsed ? '16px' : '18px',
    fontWeight: 600,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    whiteSpace: isCollapsed ? 'nowrap' : 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    textAlign: 'center'
  };

  // Styles for the country badge
  const badgeStyle = {
    fontSize: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: 'normal',
    display: isCollapsed ? 'none' : 'inline-block'
  };

  // Styles for the last updated text
  const updatedStyle = {
    margin: '4px 0 0 0',
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    display: isCollapsed ? 'none' : 'block',
    textAlign: 'center',
    width: '100%',
    visibility: 'visible',
    opacity: 1
  };

  return (
    <div style={headerStyle} className="main-header">
      <div style={titleContainerStyle}>
        <h2 style={titleStyle}>
          {title}
          <span style={badgeStyle} className="country-badge">
            {APPLE_MUSIC_COUNTRIES[country]}
          </span>
        </h2>
        
        {!isCollapsed && lastUpdated && (
          <p style={updatedStyle} className="last-updated">
            Updated: {formatDate(lastUpdated)}
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicHeader;