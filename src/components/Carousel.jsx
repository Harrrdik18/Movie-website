import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Card from './TileImage';

const Carousel = ({ movies, onMovieSelect }) => {
  // Calculate the index of the middle card
  const middleIndex = Math.floor(movies.length / 2);

  // State to track the selected card
  const [selectedCard, setSelectedCard] = useState(movies[middleIndex]?.id);

  // Effect to handle the default selected card on initial render

  const handleCardClick = (item) => {
    setSelectedCard(item.id);
    onMovieSelect(item);
  };

  return (
    <div id="carousel-container">
      <Swiper
        modules={[Pagination, Navigation]}
        className="mySwiper"
        spaceBetween={0}
        preventClicks={true}
        navigation={true}
        breakpoints={{
          // When window width is >= 320px
          320: {
            slidesPerView: 1,
          },
          // When window width is >= 480px
          480: {
            slidesPerView: 2,
          },
          // When window width is >= 640px
          640: {
            slidesPerView: 3,
          },
          // When window width is >= 800px
          800: {
            slidesPerView: 4,
          },
          // When window width is >= 960px
          960: {
            slidesPerView: 5,
          },
          // When window width is >= 1120px
          1120: {
            slidesPerView: 7,
          },
          // When window width is >= 1280px
          1280: {
            slidesPerView: 6,
          },
        }}
      >
        {movies.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className={`ClickableCard ${selectedCard === item.id ? 'selected' : ''}`}
              onClick={() => handleCardClick(item)}
            >
              <Card poster_path={item.poster_path} title={item.original_title} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
