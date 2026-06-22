import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchGenres, fetchMoviesByGenre } from "../redux/slices/movieSlice";
import {
  selectGenres,
  selectGenreMovies,
  selectGenreLoading,
} from "../redux/selectors/movieSelectors";
import "./Genre.css";

const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const genres = useSelector(selectGenres);
  const movies = useSelector(selectGenreMovies);
  const loading = useSelector(selectGenreLoading);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
    dispatch(fetchMoviesByGenre(genreName));
  };

  if (loading && !selectedGenre) {
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
          loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <div className="loading-text">Loading content...</div>
              <div className="attribution">
                This data is provided by OMDB API (Open Movie Database). Loading
                movie information...
              </div>
            </div>
          ) : (
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
          )
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
