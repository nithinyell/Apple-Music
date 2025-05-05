/**
 * This script fixes iOS safe area issues by dynamically applying CSS variables
 * It should be imported at the top of your main entry file
 */

// Function to update CSS variables for safe areas
function updateSafeAreaVariables() {
  // Get the current orientation
  const isPortrait = window.innerHeight > window.innerWidth;
  
  // Get the root element to apply CSS variables
  const root = document.documentElement;
  
  // Set CSS variables for safe areas
  root.style.setProperty('--sat', 'env(safe-area-inset-top)');
  root.style.setProperty('--sar', 'env(safe-area-inset-right)');
  root.style.setProperty('--sal', 'env(safe-area-inset-left)');
  
  // Only apply bottom safe area in landscape mode
  if (isPortrait) {
    root.style.setProperty('--sab', '0px');
    document.body.classList.add('portrait-mode');
    document.body.classList.remove('landscape-mode');
  } else {
    root.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.body.classList.add('landscape-mode');
    document.body.classList.remove('portrait-mode');
  }
}

// Run on initial load
updateSafeAreaVariables();

// Update on resize and orientation change
window.addEventListener('resize', updateSafeAreaVariables);
window.addEventListener('orientationchange', updateSafeAreaVariables);

export default updateSafeAreaVariables;