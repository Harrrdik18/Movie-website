import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesByCountry } from "../redux/slices/movieSlice";
import {
  selectCountryMovies,
  selectCountryLoading,
} from "../redux/selectors/movieSelectors";
import "./Country.css";

const Country = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movies = useSelector(selectCountryMovies);
  const loading = useSelector(selectCountryLoading);

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "BR", name: "Brazil" },
  ];

  const handleCountryClick = (countryCode) => {
    setSelectedCountry(countryCode);
    dispatch(fetchMoviesByCountry(countryCode));
  };

  return (
    <div className="country-page">
      <div className="country-sidebar">
        <h2>Countries</h2>
        <div className="country-list">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`country-button ${
                selectedCountry === country.code ? "active" : ""
              }`}
              onClick={() => handleCountryClick(country.code)}
            >
              {country.name}
            </button>
          ))}
        </div>
      </div>
      <div className="country-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <div className="loading-text">Loading content...</div>
            <div className="attribution">
              This data is provided by OMDB API (Open Movie Database). Loading
              movie information...
            </div>
          </div>
        ) : selectedCountry ? (
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
          <div className="select-country-message">
            Select a country to view movies
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;
