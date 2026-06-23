import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { MovieEntity } from "../types";

interface ContentRowProps {
  title: string;
  movies: MovieEntity[];
}

const ContentRow = ({ title, movies }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollTo =
      direction === "left"
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;
    rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-serif text-2xl lg:text-3xl text-[#f5f5f1]">
            {title}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
        </div>
      </div>

      <div className="relative group max-w-screen-2xl mx-auto px-6 lg:px-12">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] text-[#9ca3af] hover:text-[#f5f5f1] hover:border-[#c9774d] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-none pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
              className="flex-shrink-0 w-[180px] lg:w-[220px] group/card cursor-pointer"
            >
              <div className="relative overflow-hidden border border-[#2a2a2a] transition-all duration-300 group-hover/card:border-[#c9774d] group-hover/card:-translate-y-1">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-[270px] lg:h-[330px] object-cover transition-transform duration-500 group-hover/card:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-serif text-base text-[#f5f5f1] leading-tight line-clamp-1">
                  {movie.Title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">
                    {movie.Year}
                  </span>
                  {movie.imdbRating && (
                    <>
                      <span className="text-[#2a2a2a]">·</span>
                      <span className="text-xs text-[#f5c518]">
                        ★ {movie.imdbRating}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#2a2a2a] text-[#9ca3af] hover:text-[#f5f5f1] hover:border-[#c9774d] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default ContentRow;
