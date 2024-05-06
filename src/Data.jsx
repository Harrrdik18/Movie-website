import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoCard from './components/InfoCard';
import Carousel from './components/Carousel';

const MovieCard = () => {
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGE5MDU0NTNlNzE1OTZkODM5ZDgyOGIyMzhhM2FmMyIsInN1YiI6IjY1NTRlNDAyNTM4NjZlMDExYzA3MmM2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jSh9GoH-Wib5HjuieXMkWZjm_8iNc6NlJmaT4BMT2T4'
                    }
                };
                const response = await axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options);
                setData(response.data.results);
                setLoading(false)               
                }catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='fullPage'   style={{

        }}>
        
            <div className='Infocard'>
                <InfoCard movies={data} />
            </div>

            <div className='carousel'>
                <Carousel movies={data} />
            </div>
        </div>
    );
};

export default MovieCard;
