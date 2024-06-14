import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer'; // Assuming you installed it

function useIsScrolledDown() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const previousY = useRef(0);

  useEffect(() => {
    if(window){
        const handleScroll = () => {
            const currentY = window.scrollY;
            const isScrollingDown = currentY > previousY.current;
            setIsScrolledDown(isScrollingDown);
            previousY.current = currentY;
          };
      
          window.addEventListener('scroll', handleScroll);
      
          return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return isScrolledDown;
}

export default useIsScrolledDown;
