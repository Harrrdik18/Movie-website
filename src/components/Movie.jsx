import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Movie = () => {
  const { id } = useParams();
  const [bg, setBg] = useState('');
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
        setBg(response.data.backdrop_path); // Set bg directly from response
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id, authToken]);

  if (!movieDetails) {
    return <div className="flex justify-center items-center h-screen text-white text-xl">Loading movie details...</div>;
  }

  return (
    <div
      style={{
<<<<<<< HEAD
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(https://image.tmdb.org/t/p/original/${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
      className="p-5 text-white"
    >
      <div className="max-w-6xl mx-auto bg-neutral-800/75 rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-3">
          {/* Movie Poster */}
          <div className="flex justify-center items-center p-5">
            <img
              className="rounded-lg shadow-md"
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
            />
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2 p-5">
            <h1 className="text-4xl font-bold mb-3">{movieDetails.title}</h1>
            <p className="italic text-gray-300 mb-3">{movieDetails.tagline}</p>
            <p className="mb-5">{movieDetails.overview}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <span className="font-bold">Release Date:</span>{' '}
                {new Date(movieDetails.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>
                <span className="font-bold">Genres:</span>{' '}
                {movieDetails.genres.map((genre) => genre.name).join(', ')}
              </p>
              <p>
                <span className="font-bold">Languages:</span>{' '}
                {movieDetails.spoken_languages.map((lang) => lang.english_name).join(', ')}
              </p>
              <p>
                <span className="font-bold">Rating:</span> {movieDetails.vote_average} (
                {movieDetails.vote_count} votes)
              </p>
              <p>
                <span className="font-bold">Adult Content:</span>{' '}
                {movieDetails.adult ? 'Yes' : 'No'}
              </p>
              <p>
                <span className="font-bold">Runtime:</span> {movieDetails.runtime} minutes
              </p>
            </div>
          </div>
=======
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.341), rgb(0, 0, 0)), url(https://image.tmdb.org/t/p/original/${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="flex mt-auto border-solid border-2 border-slate-600 bg-slate-400/50 scale-95 w-75 justify-center mx-auto">
        <div className="flex">
          <img
            className="h-full w-10%"
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="font-serif">{movieDetails.title}</h1>
          <p className="text-2xl mt-5">{movieDetails.overview}</p>
          <p className="text-2xl">
            {new Date(movieDetails.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-2xl">
            Genre: {movieDetails.genres.map((genre) => genre.name).join(', ')}
          </p>
>>>>>>> f15dacd662f7fc6eb5a7b1a73691fb312cc5d74e
        </div>
      </div>
    </div>
  );
};

export default Movie;
