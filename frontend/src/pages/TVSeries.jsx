import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTVShows } from "../redux/slices/movieSlice";
import {
  selectTVShows,
  selectTVLoading,
  selectTVTotalPages,
} from "../redux/selectors/movieSelectors";
import "./TVSeries.css";

const TVSeries = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shows = useSelector(selectTVShows);
  const loading = useSelector(selectTVLoading);
  const totalPages = useSelector(selectTVTotalPages);

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    const params = {};
    if (year) params.year = year;
    dispatch(fetchTVShows(params));
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
            This data is provided by OMDB API (Open Movie Database). Loading TV
            show information...
          </div>
        </div>
      ) : (
        <>
          <div className="shows-grid">
            {shows.map((show) => (
              <div
                key={show.imdbID}
                className="show-card"
                onClick={() => navigate(`/tv/${show.imdbID}`)}
              >
                <img src={show.Poster} alt={show.Title} />
                <div className="show-info">
                  <h3>{show.Title}</h3>
                  <p>{show.Year}</p>
                  <div className="show-rating">
                    <span>★</span> {show.imdbRating || "N/A"}
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
