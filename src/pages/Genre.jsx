import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Genre.css';

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = import.meta.env.VITE_AUTH;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list?language=en',
          {
            headers: { Authorization: authToken },
          }
        );
        setGenres(response.data.genres);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [authToken]);

  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc`,
        {
          headers: { Authorization: authToken },
        }
      );
      setMovies(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="genre-page">
      <div className="genre-sidebar">
        <h2>Genres</h2>
        <div className="genre-list">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      <div className="genre-content">
        {selectedGenre ? (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.release_date?.split('-')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="select-genre-message">
            Select a genre to view movies
          </div>
        )}
      </div>
    </div>
  );
};

export default Genre; 