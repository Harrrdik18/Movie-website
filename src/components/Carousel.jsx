import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import Card from './Card';

const Carousel = ({movies}) => {
    return (
        <div>

        <Swiper
        spaceBetween={50}
        slidesPerView={6}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        >  
        {movies.map((item,index)=>(
            <SwiperSlide key={index}>
                <Card poster_path={item.poster_path} />
                 </SwiperSlide>

        ))}


        </Swiper>
        </div>
    )
}
export default Carousel