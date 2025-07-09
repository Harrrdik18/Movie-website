import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesByGenre, getGenres } from "../services/tmdbService";
import "./Genre.css";

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres("en");
        setGenres(response.genres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    setLoading(true);
    try {
      const response = await getMoviesByGenre(genreId, "en-US");
      setMovies(response.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div className="loading-text">Loading content...</div>
        <div className="attribution">
          This data is provided by TMDB API. There might be loading times
          sometimes.
        </div>
      </div>
    );
  }

  return (
    <div className="genre-page">
      <div className="genre-sidebar">
        <h2>Genres</h2>
        <div className="genre-list">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-button ${
                selectedGenre === genre.id ? "active" : ""
              }`}
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
                  <p>{movie.release_date?.split("-")[0]}</p>
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
