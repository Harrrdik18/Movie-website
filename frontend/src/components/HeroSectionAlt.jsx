import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSectionAlt.css";

const HeroSectionAlt = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let interval;
    if (isAutoPlaying && movies.length > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 6000); // Change slide every 6 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 800);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 800);
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const releaseYear = currentMovie.Year;
  const rating = currentMovie.imdbRating || "N/A";

  return (
    <div className="hero-section-alt">
      {/* Animated Background */}
      <div className="hero-background-container">
        {movies.map((movie, index) => (
          <div
            key={movie.imdbID || movie.id}
            className={`hero-background-slide ${
              index === currentIndex ? "active" : ""
            }`}
            style={{
              backgroundImage: `url(${movie.Poster})`,
              transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${
                (mousePosition.y - 50) * 0.02
              }px)`,
            }}
          />
        ))}
        <div className="hero-overlay-gradient" />
        <div className="hero-particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="hero-content-alt">
        <div className="hero-content-inner">
          <div className="hero-badge-alt">
            <span className="badge-icon">⭐</span>
            <span>Featured Movie</span>
          </div>

          <h1 className="hero-title-alt">
            {currentMovie.Title}
            <div className="title-glow"></div>
          </h1>

          <div className="hero-meta-alt">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{releaseYear}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⭐</span>
              <span>{rating}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>{currentMovie.Runtime || "N/A"}</span>
            </div>
          </div>

          <p className="hero-description-alt">
            {currentMovie.Plot ||
              "Discover an amazing cinematic experience with this featured movie."}
          </p>

          <div className="hero-genres-alt">
            {currentMovie.Genre &&
              currentMovie.Genre.split(", ")
                .slice(0, 3)
                .map((genre, idx) => (
                  <span key={idx} className="hero-genre-tag">
                    {genre}
                  </span>
                ))}
          </div>

          <div className="hero-actions-alt">
            <button
              className="hero-btn primary"
              onClick={() => navigate(`/movie/${currentMovie.imdbID}`)}
            >
              <span className="btn-icon">▶</span>
              <span className="btn-text">Watch Now</span>
              <div className="btn-ripple"></div>
            </button>

            <button
              className="hero-btn secondary"
              onClick={() => navigate(`/movie/${currentMovie.imdbID}`)}
            >
              <span className="btn-icon">ℹ</span>
              <span className="btn-text">More Info</span>
              <div className="btn-ripple"></div>
            </button>

            <button className="hero-btn tertiary">
              <span className="btn-icon">♡</span>
              <span className="btn-text">Watchlist</span>
              <div className="btn-ripple"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="hero-navigation-alt">
        <button
          className="nav-arrow prev"
          onClick={handlePrev}
          disabled={isTransitioning}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <div className="nav-indicators">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`nav-indicator ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
            >
              <div className="indicator-progress">
                <div
                  className="progress-fill"
                  style={{
                    animationDuration:
                      index === currentIndex && isAutoPlaying ? "6s" : "0s",
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        <button
          className="nav-arrow next"
          onClick={handleNext}
          disabled={isTransitioning}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>

      {/* Movie Info Cards */}
      <div className="hero-movie-cards">
        {movies.slice(0, 5).map((movie, index) => (
          <div
            key={movie.imdbID || movie.id}
            className={`movie-card ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          >
            <img src={movie.Poster} alt={movie.Title} />
            <div className="card-overlay">
              <h4>{movie.Title}</h4>
              <p>{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-arrow">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionAlt;
