import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { MovieEntity } from "../types";
import "./HeroSection.css";

interface HeroSectionProps {
  movies: MovieEntity[];
}

const HeroSection = ({ movies }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, movies.length]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const releaseYear = currentMovie.Year;
  const rating = currentMovie.imdbRating || "N/A";

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">Featured</div>
        <h1 className="hero-title">{currentMovie.Title}</h1>
        <div className="hero-meta">
          <span className="hero-year">{releaseYear}</span>
          <span className="hero-rating">★ {rating}</span>
          <span className="hero-duration">{currentMovie.Runtime || "N/A"}</span>
        </div>
        <p className="hero-description">{currentMovie.Plot}</p>
        <div className="hero-genres">
          {currentMovie.Genre &&
            currentMovie.Genre.split(", ").map((genre, idx) => (
              <span key={idx} className="hero-genre">
                {genre}
              </span>
            ))}
        </div>
        <div className="hero-buttons">
          <button
            className="play-button"
            onClick={() => navigate(`/movie/${currentMovie.imdbID}`)}
          >
            <span className="play-icon">▶</span>
            Play Now
          </button>
          <button
            className="more-info-button"
            onClick={() => navigate(`/movie/${currentMovie.imdbID}`)}
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
            key={movie.imdbID}
            className={`hero-background ${
              index === currentIndex ? "active" : ""
            }`}
            src={movie.Poster}
            alt={movie.Title}
          />
        ))}
      </div>

      <div className="hero-navigation">
        <button className="nav-button prev" onClick={handlePrev}>
          ‹
        </button>
        <div className="nav-dots">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? "active" : ""}`}
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

const getGenreName = (genreId: number): string => {
  const genres: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  return genres[genreId] || "";
};

export default HeroSection;
