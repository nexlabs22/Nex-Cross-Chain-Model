import React, { useState, Children, ReactNode, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';
import { useCallback } from 'react';

interface CarouselProps {
  children: ReactNode;
  autoPlay?: boolean;
  transitionDuration?: number;
  dotColor?: string;
  arrowColor?: string;
  swipeable?: boolean;
  slidesPerView?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  transitionDuration = 500,
  dotColor = 'info.main',
  arrowColor = 'text.primary',
  swipeable = false,
  slidesPerView = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  spacing = 0,
  interval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = Children.count(children);
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  const getSlidesPerView = () => {
    if (isXs) return slidesPerView.xs || 1;
    if (isSm) return slidesPerView.sm || 2;
    if (isMd) return slidesPerView.md || 3;
    if (isLg) return slidesPerView.lg || 4;
    if (isXl) return slidesPerView.xl || 5;
    return 1; // Default fallback
  };

  const slidesToShow = getSlidesPerView();

  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % (totalSlides - slidesToShow + 1));
  }, [totalSlides, slidesToShow]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + (totalSlides - slidesToShow + 1)) % (totalSlides - slidesToShow + 1));
  }, [totalSlides, slidesToShow]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => swipeable && handleNext(),
    onSwipedRight: () => swipeable && handlePrev(),
    trackMouse: true,
  });

  useEffect(() => {
    if (autoPlay) {
      const slidingInterval = setInterval(() => {
        handleNext();
      }, interval);
      return () => clearInterval(slidingInterval);
    }
  }, [autoPlay, activeIndex, interval, handleNext]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
      role="region"
      aria-label="Carousel"
      aria-live="polite"
    >
      {/* Slides */}
      <Box
        {...(swipeable ? swipeHandlers : {})}
        sx={{
          display: 'flex',
          transition: `transform ${transitionDuration}ms ease`,
          transform: `translateX(-${activeIndex * (100 / slidesToShow)}%)`,
          marginLeft: `-${spacing / 2}px`,
          marginRight: `-${spacing / 2}px`,
        }}
      >
        {Children.map(children, (child, index) => (
          <Box
            key={index}
            sx={{
              minWidth: `calc(${100 / slidesToShow}% - ${spacing}px)`,
              boxSizing: 'border-box',
              marginLeft: `${spacing / 2}px`,
              marginRight: `${spacing / 2}px`,
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <IconButton onClick={handlePrev} sx={{ color: arrowColor }}>
          <ChevronLeft />
        </IconButton>
        {Array.from({ length: totalSlides - slidesToShow + 1 }).map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              color: index === activeIndex ? dotColor : theme.palette.text.secondary,
              p: 0.5,
            }}
          >
            <Typography variant="body2">•</Typography>
          </IconButton>
        ))}
        <IconButton onClick={handleNext} sx={{ color: arrowColor }}>
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Carousel;