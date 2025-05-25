import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { discoverMovies } from "../services/tmdbService";
import "./Movies.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    fetchMovies();
  }, [page, sortBy, year]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        language: "en-US",
        sort_by: sortBy,
        page: page,
      };

      if (year) {
        params.primary_release_year = year;
      }

      const response = await discoverMovies(params);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Loading content...</div>
          <div className="attribution">
            This data is provided by TMDB API. There might be loading times
            sometimes.
          </div>
        </div>
      ) : (
        <>
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
                  <div className="movie-rating">
                    <span>★</span> {movie.vote_average.toFixed(1)}
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
