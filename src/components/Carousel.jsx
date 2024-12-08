import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Card from './TileImage';

const Carousel = ({ movies, setBackgroundImageUrl }) => {
const [selectedCard, setSelectedCard] = useState(movies[3]?.id);

const navigate = useNavigate();

  const handleCardClick = (movie) => {
    setSelectedCard(movie.id);
    setBackgroundImageUrl(movie.backdrop_path);
    navigate(`/movie/${movie.id}`);
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
          320: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          800: {
            slidesPerView: 4,
          },
          960: {
            slidesPerView: 5,
          },
          1120: {
            slidesPerView: 7,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
      >
        {movies.map((item) => (
          <SwiperSlide key={item.id}>
            <div className={`ClickableCard ${selectedCard === item.id ? 'selected' : ''}`}
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
