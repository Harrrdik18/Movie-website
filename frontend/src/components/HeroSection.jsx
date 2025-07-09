import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const releaseYear = currentMovie.release_date?.split('-')[0];
  const rating = currentMovie.vote_average?.toFixed(1);

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">Featured</div>
        <h1 className="hero-title">{currentMovie.title}</h1>
        <div className="hero-meta">
          <span className="hero-year">{releaseYear}</span>
          <span className="hero-rating">★ {rating}</span>
          <span className="hero-duration">{currentMovie.runtime} min</span>
        </div>
        <p className="hero-description">{currentMovie.overview}</p>
        <div className="hero-genres">
          {currentMovie.genre_ids?.map((genreId) => (
            <span key={genreId} className="hero-genre">
              {getGenreName(genreId)}
            </span>
          ))}
        </div>
        <div className="hero-buttons">
          <button 
            className="play-button"
            onClick={() => navigate(`/movie/${currentMovie.id}`)}
          >
            <span className="play-icon">▶</span>
            Play Now
          </button>
          <button 
            className="more-info-button"
            onClick={() => navigate(`/movie/${currentMovie.id}`)}
          >
            <span className="info-icon">ℹ</span>
            More Info
          </button>
        </div>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-backgrounds">
        {movies.map((movie, index) => (
          <img
            key={movie.id}
            className={`hero-background ${index === currentIndex ? 'active' : ''}`}
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
          />
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="hero-navigation">
        <button className="nav-button prev" onClick={handlePrev}>
          ‹
        </button>
        <div className="nav-dots">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        <button className="nav-button next" onClick={handleNext}>
          ›
        </button>
      </div>
    </div>
  );
};

// Helper function to get genre name from ID
const getGenreName = (genreId) => {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[genreId] || '';
};

export default HeroSection; 