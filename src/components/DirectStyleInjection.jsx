import React, { useEffect } from 'react';

/**
 * Component that injects critical CSS directly into the document head
 * This helps fix PWA display issues without waiting for CSS files to load
 */
const DirectStyleInjection = () => {
  useEffect(() => {
    // Check if we're in PWA mode
    const isPwa = window.navigator.standalone || 
                 window.matchMedia('(display-mode: standalone)').matches;
    
    if (isPwa) {
      // Create a style element
      const style = document.createElement('style');
      style.id = 'pwa-critical-css';
      
      // Add critical CSS for fixing the menu bar issue
      style.textContent = `
        /* Critical PWA fixes - ONLY for standalone mode */
        @media all and (display-mode: standalone) {
          body {
            padding: 0 !important;
            margin: 0 !important;
            overflow-x: hidden !important;
          }
          
          /* Fix for the menu bar at top of screen */
          .main-header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1000 !important;
            padding-top: env(safe-area-inset-top, 0px) !important;
            min-height: calc(44px + env(safe-area-inset-top, 0px)) !important;
          }
          
          /* Add padding to main content to prevent it from being hidden under the header */
          .main-content {
            padding-top: calc(44px + env(safe-area-inset-top, 0px)) !important;
            margin-top: 0 !important;
          }
        }
        
        /* Fix for iOS devices in standalone mode */
        @supports (-webkit-touch-callout: none) and (display-mode: standalone) {
          .main-header {
            padding-top: env(safe-area-inset-top, 0px) !important;
          }
        }
      `;
      
      // Add the style to the document head
      document.head.appendChild(style);
      
      // Clean up on unmount
      return () => {
        const styleElement = document.getElementById('pwa-critical-css');
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, []);
  
  return null; // This component doesn't render anything
};

export default DirectStyleInjection;