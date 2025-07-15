import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesByGenre, getGenres } from "../services/omdbService";
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

  const handleGenreClick = async (genreName) => {
    setSelectedGenre(genreName);
    setLoading(true);
    try {
      const response = await getMoviesByGenre(genreName);
      setMovies(response.Search || []);
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
          This data is provided by OMDB API (Open Movie Database). Loading movie
          information...
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
                selectedGenre === genre.name ? "active" : ""
              }`}
              onClick={() => handleGenreClick(genre.name)}
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
                key={movie.imdbID}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.imdbID}`)}
              >
                <img src={movie.Poster} alt={movie.Title} />
                <div className="movie-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
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
