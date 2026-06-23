import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { MovieEntity } from "../types";
import GradientBackground from "./GradientBackground";

interface HeroSectionProps {
  movies: MovieEntity[];
}

const HeroSection = ({ movies }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  }, [movies.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  if (!movies || movies.length === 0) return null;

  const current = movies[currentIndex];

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {movies.map((movie, index) => (
        <div
          key={movie.imdbID}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <GradientBackground genre={movie.Genre} />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-20" />

      <div
        className="relative z-20 h-full max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center"
        key={current.imdbID}
      >
        <div className="w-full flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 animate-fade-in">
          <div className="flex-1 max-w-2xl lg:order-1">
            <span className="text-[#9ca3af] text-xs uppercase tracking-[0.2em] font-medium">
              Featured
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-[#f5f5f1] mt-4 leading-tight">
              {current.Title}
            </h1>

            <div className="flex items-center gap-4 mt-4 text-sm text-[#9ca3af] uppercase tracking-[0.1em]">
              <span>{current.Year}</span>
              <span className="w-px h-3 bg-[#2a2a2a]" />
              <span>{current.Runtime || "N/A"}</span>
              <span className="w-px h-3 bg-[#2a2a2a]" />
              <span className="text-[#f5c518]">★ {current.imdbRating || "N/A"}</span>
            </div>

            {current.Plot && (
              <p className="mt-6 text-[#9ca3af] text-base leading-relaxed line-clamp-3 max-w-xl font-light">
                {current.Plot}
              </p>
            )}

            {current.Genre && (
              <div className="flex flex-wrap gap-2 mt-6">
                {current.Genre.split(", ").map((genre) => (
                  <span
                    key={genre}
                    className="text-xs uppercase tracking-[0.15em] text-[#9ca3af] border border-[#2a2a2a] px-3 py-1"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate(`/movie/${current.imdbID}`)}
              className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#f5f5f1] border-b border-[#c9774d] pb-0.5 hover:text-[#c9774d] transition-colors group"
            >
              View Details
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div className="lg:order-2 flex-shrink-0">
            <div className="relative w-48 sm:w-56 lg:w-72">
              <div className="border border-[#2a2a2a] overflow-hidden shadow-2xl">
                <img
                  src={current.Poster}
                  alt={current.Title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="text-[#9ca3af] hover:text-[#f5f5f1] transition-colors text-lg"
          aria-label="Previous"
        >
          ‹
        </button>
        <div className="flex items-center gap-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 h-0.5 bg-[#c9774d]"
                  : "w-4 h-0.5 bg-[#2a2a2a] hover:bg-[#9ca3af]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="text-[#9ca3af] hover:text-[#f5f5f1] transition-colors text-lg"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
