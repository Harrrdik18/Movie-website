import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './components/Carousel';
import InfoCard from './components/InfoCard/InfoCard';

const MovieCard = ({ setBackgroundImage }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setBackgroundImage(movie.backdrop_path)
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='fullPage'>
            <div className='Infocard'>
                {selectedMovie && <InfoCard movie={selectedMovie} />}
            </div>
            <div className='carousel'>
                <Carousel movies={data} onMovieSelect={handleMovieSelect} />
            </div>
            
        </div>
    );
};

export default MovieCard;
