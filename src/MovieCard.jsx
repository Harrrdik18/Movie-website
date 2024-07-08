import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from './components/Carousel';
import InfoCard from './components/InfoCard2/InfoCard';

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
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGE5MDU0NTNlNzE1OTZkODM5ZDgyOGIyMzhhM2FmMyIsIm5iZiI6MTcyMDQ1OTI5NC44OTYyMTMsInN1YiI6IjY1NTRlNDAyNTM4NjZlMDExYzA3MmM2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XlGMiwxS7MfjmHXGe40LB45HilAO_lyZM1-52Xp7mL4' 
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

    const handleMovieSelect = async (movie) => {
        setLoading(true);
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGE5MDU0NTNlNzE1OTZkODM5ZDgyOGIyMzhhM2FmMyIsIm5iZiI6MTcyMDQ1OTI5NC44OTYyMTMsInN1YiI6IjY1NTRlNDAyNTM4NjZlMDExYzA3MmM2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XlGMiwxS7MfjmHXGe40LB45HilAO_lyZM1-52Xp7mL4' // Replace with your actual access token
                }
            };
            const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, options);
            const movieCredits = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, options);

            const movieWithCast = {
                ...movieDetails.data,
                cast: movieCredits.data.cast,
            };

            setSelectedMovie(movieWithCast);
            setBackgroundImage(movie.backdrop_path);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setLoading(false);
        }
    };


    return (
        <div className='fullPage'>
        {loading && <div>Loading...</div>}
        {!loading && (
          <>
            <div className='info-card-container'>
              {selectedMovie && <InfoCard movie={selectedMovie} />}
            </div>
            <div className='carousel-container'>
              <Carousel movies={data} onMovieSelect={handleMovieSelect} />
            </div>
          </>
        )}
      </div>
    );
};

export default MovieCard;
