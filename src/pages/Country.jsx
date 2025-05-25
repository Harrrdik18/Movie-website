import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMoviesByCountry } from "../services/tmdbService";
import "./Country.css";

const Country = () => {
  const [countries, setCountries] = useState([
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
  ]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCountryClick = async (countryCode) => {
    setSelectedCountry(countryCode);
    setLoading(true);
    try {
      const response = await getMoviesByCountry(countryCode, "en-US");
      setMovies(response.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies by country:", error);
      setLoading(false);
    }
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
              This data is provided by TMDB API. There might be loading times
              sometimes.
            </div>
          </div>
        ) : selectedCountry ? (
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
          <div className="select-country-message">
            Select a country to view movies
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;
