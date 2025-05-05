/**
 * This script fixes iOS safe area issues by dynamically applying CSS variables
 * It should be imported at the top of your main entry file
 */

// Function to update CSS variables for safe areas
function updateSafeAreaVariables() {
  // Get the current orientation
  const isPortrait = window.innerHeight > window.innerWidth;
  
  // Check if we're in PWA mode
  const isPwa = window.navigator.standalone || 
               window.matchMedia('(display-mode: standalone)').matches;
  
  // Get the root element to apply CSS variables
  const root = document.documentElement;
  
  // Set CSS variables for safe areas - ensure we get actual pixel values
  const computeSafeAreaValue = (property) => {
    // Try to get the computed value
    const value = getComputedStyle(document.documentElement).getPropertyValue(property);
    // If it's a valid pixel value, return it, otherwise use the env() function
    return value && value !== '0px' ? value : `env(${property}, 0px)`;
  };
  
  // Apply safe area insets with fallbacks
  root.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
  root.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
  root.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
  
  // Only apply bottom safe area in landscape mode
  if (isPortrait) {
    root.style.setProperty('--sab', '0px');
    document.body.classList.add('portrait-mode');
    document.body.classList.remove('landscape-mode');
    
    // Fix black area at bottom in portrait mode
    document.body.style.paddingBottom = '0';
    document.documentElement.style.paddingBottom = '0';
  } else {
    root.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
    document.body.classList.add('landscape-mode');
    document.body.classList.remove('portrait-mode');
  }
  
  // Add or remove PWA mode class based on display mode
  if (isPwa) {
    document.body.classList.add('pwa-mode');
    
    // Add a class to the html element as well for broader CSS targeting
    document.documentElement.classList.add('pwa-mode');
  } else {
    document.body.classList.remove('pwa-mode');
    document.documentElement.classList.remove('pwa-mode');
  }
  
  // Force a reflow to ensure the CSS variables are applied
  document.body.offsetHeight;
  
  // Check if running as PWA
  if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('pwa-mode');
  } else {
    document.body.classList.remove('pwa-mode');
  }
}

// Run on initial load
updateSafeAreaVariables();

// Update on resize and orientation change
window.addEventListener('resize', updateSafeAreaVariables);
window.addEventListener('orientationchange', updateSafeAreaVariables);

// Fix iOS height issues
function setAppHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Run on initial load
setAppHeight();

// Update on resize and orientation change
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);

export default updateSafeAreaVariables;