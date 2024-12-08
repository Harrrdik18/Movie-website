import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Movie = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const authToken = import.meta.env.VITE_AUTH;


  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
          headers: {
            Authorization: authToken,
          },
        });
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie detadwils:', error);
      }
    };

    fetchMovieDetails();
  }, [id, authToken]);

  if (!movieDetails) {
    return <div>Loading movie details...</div>;
  }

  return (
    <div className="flex mt-auto border-solid border-2 border-slate-600 bg-slate-400/50 scale-95 w-75 justify-center mx-auto">
      <div className='flex '>
      <img className='h-full w-10%'
        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
        alt={movieDetails.title}
      />
      </div>
      <div className='flex flex-1 flex-col justify-center'>
      <h1 className='font-serif'>{movieDetails.title}</h1>
      <p className='text-2xl mt-5'>{movieDetails.overview}</p>
      <p className='text-2xl'>{new Date(movieDetails.release_date).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}</p>

<p className='text-2xl'>Genre : {movieDetails.genres.map((genre) => genre.name).join(", ")}</p>
      </div>

    </div>
  );
};

export default Movie;
