import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Card from './TileImage';

const Carousel = ({ movies, onMovieSelect }) => {
  // Calculate the index of the middle card
  const middleIndex = Math.floor(movies.length / 2);

  // State to track the selected card
  const [selectedCard, setSelectedCard] = useState(movies[middleIndex]?.id);

  // Effect to handle the default selected card
  useEffect(() => {
    // Trigger onMovieSelect only if it's the initial render and the selected card is the middle one
    if (selectedCard === movies[middleIndex]?.id) {
      onMovieSelect(movies[middleIndex]);
    }
  }, [movies, middleIndex, onMovieSelect, selectedCard]);

  const handleCardClick = (item) => {
    setSelectedCard(item.id);
    onMovieSelect(item);
  };

  return (
    <div id="carousel-container">
      <Swiper modules={[Pagination]} spaceBetween={0} slidesPerView={8} preventClicks={true}>
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
