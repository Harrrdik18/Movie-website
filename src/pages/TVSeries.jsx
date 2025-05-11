import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TVSeries.css";

const TVSeries = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const authToken = import.meta.env.VITE_AUTH;

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    fetchShows();
  }, [page, sortBy, year]);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=${sortBy}&page=${page}${
          year ? `&first_air_date_year=${year}` : ""
        }`,
        {
          headers: { Authorization: authToken },
        }
      );
      setShows(response.data.results);
      setTotalPages(response.data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
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
    <div className="tv-series-page">
      <div className="tv-series-filters">
        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="first_air_date.desc">Air Date</option>
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
          <div className="shows-grid">
            {shows.map((show) => (
              <div
                key={show.id}
                className="show-card"
                onClick={() => navigate(`/tv/${show.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                />
                <div className="show-info">
                  <h3>{show.name}</h3>
                  <p>{show.first_air_date?.split("-")[0]}</p>
                  <div className="show-rating">
                    <span>★</span> {show.vote_average.toFixed(1)}
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

export default TVSeries;
