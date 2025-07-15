import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ContentRow.css";

const ContentRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button className="row-button left" onClick={() => scroll("left")}>
          ‹
        </button>
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <div
              key={movie.imdbID || movie.id}
              className="row-poster"
              onClick={() => navigate(`/movie/${movie.imdbID || movie.id}`)}
            >
              <img src={movie.Poster} alt={movie.Title || movie.title} />
              <div className="poster-info">
                <h3>{movie.Title || movie.title}</h3>
                <div className="poster-meta">
                  <p>{movie.Year}</p>
                  <div className="poster-rating">
                    <span>★</span>
                    {movie.imdbRating || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="row-button right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
