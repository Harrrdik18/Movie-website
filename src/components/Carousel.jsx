import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/pagination';
import Card from './TileImage';


const Carousel = ({ movies, onMovieSelect }) => {


    return ( 
        <div id="carousel-container">
            <Swiper
             modules={[Pagination]}
                spaceBetween={0}
                slidesPerView={8}
                preventClicks={true}
                
            >
                {movies.map((item) => (
                    <SwiperSlide key={item.id}>
                     <div className="ClickableCard" onClick={() => onMovieSelect(item)}>
                        <Card
                            poster_path={item.poster_path}
                            title={item.original_title}
                        />
                       </div> 
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Carousel