import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css';

const Movie = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = import.meta.env.VITE_AUTH;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [detailsRes, creditsRes, similarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            headers: { Authorization: authToken },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, {
            headers: { Authorization: authToken },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US`, {
            headers: { Authorization: authToken },
          }),
        ]);

        setMovieDetails(detailsRes.data);
        setCast(creditsRes.data.cast.slice(0, 6));
        setSimilarMovies(similarRes.data.results.slice(0, 6));
        setError(null);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, authToken]);

  if (loading) {
    return <div className="movie-loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="movie-error">{error}</div>;
  }

  if (!movieDetails) {
    return <div className="movie-error">No movie details found.</div>;
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-page">
      {/* Hero Section */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`
        }}
      >
        <div className="movie-hero-content">
          <div className="movie-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
              }}
            />
          </div>
          <div className="movie-info">
            <h1>{movieDetails.title}</h1>
            {movieDetails.tagline && (
              <p className="movie-tagline">{movieDetails.tagline}</p>
            )}
            
            <div className="movie-meta">
              {movieDetails.release_date && (
                <span className="movie-year">{movieDetails.release_date.split('-')[0]}</span>
              )}
              <span className="movie-runtime">{formatRuntime(movieDetails.runtime)}</span>
              <span className="movie-rating">★ {movieDetails.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>

            {movieDetails.genres && movieDetails.genres.length > 0 && (
              <div className="movie-genres">
                {movieDetails.genres.map(genre => (
                  <span key={genre.id} className="movie-genre">{genre.name}</span>
                ))}
              </div>
            )}

            {movieDetails.overview && (
              <p className="movie-overview">{movieDetails.overview}</p>
            )}

            <div className="movie-details-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value">{movieDetails.status || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Budget</span>
                <span className="detail-value">{formatCurrency(movieDetails.budget)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Revenue</span>
                <span className="detail-value">{formatCurrency(movieDetails.revenue)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Language</span>
                <span className="detail-value">{movieDetails.original_language?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="movie-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {cast.map(person => (
              <div key={person.id} className="cast-card">
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                  }}
                />
                <h3>{person.name}</h3>
                <p>{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="movie-section">
          <h2>Similar Movies</h2>
          <div className="similar-movies-grid">
            {similarMovies.map(movie => (
              <div key={movie.id} className="similar-movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }}
                />
                <div className="similar-movie-info">
                  <h3>{movie.title}</h3>
                  <div className="similar-movie-meta">
                    <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <span>★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
