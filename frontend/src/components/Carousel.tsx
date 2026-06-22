import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Card from './TileImage';

interface CarouselMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_title: string;
}

interface CarouselProps {
  movies: CarouselMovie[];
  setBackgroundImageUrl: (url: string) => void;
}

const Carousel = ({ movies, setBackgroundImageUrl }: CarouselProps) => {
  const [selectedCard, setSelectedCard] = useState(movies[3]?.id);
  const navigate = useNavigate();

  const handleCardClick = (movie: CarouselMovie) => {
    setSelectedCard(movie.id);
    setBackgroundImageUrl(movie.backdrop_path);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div id="carousel-container">
      <Swiper
        modules={[Pagination, Navigation]}
        className="mySwiper"
        spaceBetween={45}
        preventClicks={true}
        navigation={true}
        scrollbar={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          800: { slidesPerView: 4 },
          960: { slidesPerView: 5 },
          1120: { slidesPerView: 7 },
          1280: { slidesPerView: 6 },
          1600: { slidesPerView: 8 },
          1920: { slidesPerView: 9 },
        }}
      >
        {movies.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className={`ClickableCard ${selectedCard === item.id ? "selected" : ""}`}
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
