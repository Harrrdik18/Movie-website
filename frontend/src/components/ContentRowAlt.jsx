import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContentRowAlt.css";

const ContentRowAlt = ({ title, movies }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="content-row-alt">
      <div className="row-header-alt">
        <h2 className="row-title-alt">
          <span className="title-text">{title}</span>
          <div className="title-underline"></div>
        </h2>
        <div className="row-controls">
          <button className="control-btn prev" onClick={() => scroll("left")}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button className="control-btn next" onClick={() => scroll("right")}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="row-container-alt">
        <div className="row-posters-alt" ref={rowRef}>
          {movies.map((movie, index) => (
            <div
              key={movie.imdbID || movie.id}
              className={`movie-card-alt ${
                hoveredIndex === index ? "hovered" : ""
              }`}
              onClick={() => navigate(`/movie/${movie.imdbID || movie.id}`)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="card-image-container">
                <img
                  src={movie.Poster}
                  alt={movie.Title || movie.title}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="play-button">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <h3 className="movie-title">{movie.Title || movie.title}</h3>
                <div className="movie-meta">
                  <span className="movie-year">{movie.Year}</span>
                  <div className="movie-rating">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                    </svg>
                    <span>{movie.imdbRating || "N/A"}</span>
                  </div>
                </div>

                <div className="movie-genres">
                  {movie.Genre &&
                    movie.Genre.split(", ")
                      .slice(0, 2)
                      .map((genre, idx) => (
                        <span key={idx} className="genre-tag">
                          {genre}
                        </span>
                      ))}
                </div>

                <div className="card-actions">
                  <button className="action-btn primary">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    Watch
                  </button>
                  <button className="action-btn secondary">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <button className="action-btn secondary">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRowAlt;
