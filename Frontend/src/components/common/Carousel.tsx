import React, { ReactNode } from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselProps {
  children: ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  infinite?: boolean;
  responsive?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesToShow = 3,
  autoplay = true,
  autoplaySpeed = 3200,
  dots = true,
  infinite = true,
  responsive = true,
}) => {
  const settings = {
    dots,
    infinite,
    speed:  3200,
    slidesToShow,
    slidesToScroll: 1,
    autoplay,
    autoplaySpeed,
    pauseOnHover: true,
    responsive: responsive ? [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ] : undefined,
  };

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      mx: 'auto',
      '& .slick-slide': {
        px: 2,
      },
      '& .slick-dots': {
        bottom: -40,
      },
      '& .slick-dots li button:before': {
        fontSize: '10px',
        color: 'primary.main',
      },
      '& .slick-dots li.slick-active button:before': {
        color: 'primary.main',
      },
    }}>
      <Slider {...settings}>
        {children}
      </Slider>
    </Box>
  );
};

export default Carousel;