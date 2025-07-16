import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { discoverMovies } from "../services/omdbService";
import {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
} from "../redux/slices/movieSlice";
import "./Movies.css";

const Movies = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies, status, error } = useSelector((state) => state.movies);

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    const fetchMoviesData = async () => {
      dispatch(fetchMoviesStart());
      try {
        const params = {};

        if (year) {
          params.year = year;
        }

        const response = await discoverMovies(params);
        dispatch(fetchMoviesSuccess(response.Search || []));
        setTotalPages(Math.ceil((response.totalResults || 0) / 10));
      } catch (error) {
        dispatch(fetchMoviesFailure(error.toString()));
      }
    };
    fetchMoviesData();
  }, [page, sortBy, year, dispatch]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setPage(1);
  };

  return (
    <div className="movies-page">
      <div className="movies-filters">
        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Release Date</option>
            <option value="revenue.desc">Revenue</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Year:</label>
          <select value={year} onChange={handleYearChange}>
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Loading content...</div>
          <div className="attribution">
            This data is provided by OMDB API (Open Movie Database). Loading
            movie information...
          </div>
        </div>
      ) : status === "failed" ? (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      ) : (
        <>
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
                  <div className="movie-rating">
                    <span>★</span> {movie.imdbRating || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
