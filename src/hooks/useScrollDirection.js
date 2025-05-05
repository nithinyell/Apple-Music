import { useState, useEffect } from 'react';

/**
 * Custom hook to detect scroll direction
 * @returns {Object} Object containing scroll direction and position
 */
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      
      // Store current scroll position
      setScrollPosition(scrollY);
      
      // Check if at top
      setIsAtTop(scrollY < 10);
      
      // Determine direction
      if (scrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Clean up
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDirection, scrollPosition, isAtTop };
};

export default useScrollDirection;