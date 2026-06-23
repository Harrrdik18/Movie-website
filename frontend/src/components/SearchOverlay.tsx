import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { MovieEntity } from "../types";

interface SearchOverlayProps {
  query: string;
  results: MovieEntity[];
  onClose: () => void;
  onQueryChange: (query: string) => void;
}

const SearchOverlay = ({ query, results, onClose, onQueryChange }: SearchOverlayProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSelect = (imdbID: string) => {
    navigate(`/movie/${imdbID}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-sm animate-fade-in">
      <div className="max-w-3xl mx-auto pt-24 lg:pt-32 px-6">
        <div className="flex items-center gap-4 mb-8">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search films..."
            className="flex-1 bg-transparent border-b border-[#2a2a2a] text-2xl lg:text-3xl text-[#f5f5f1] py-2 font-serif placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#c9774d] transition-colors"
          />
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f5f5f1] transition-colors text-sm uppercase tracking-[0.15em]"
          >
            Close
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh]">
            {results.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => handleSelect(movie.imdbID)}
                className="group cursor-pointer"
              >
                <div className="border border-[#2a2a2a] overflow-hidden transition-all group-hover:border-[#c9774d]">
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm text-[#f5f5f1] line-clamp-1 font-serif">
                    {movie.Title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.1em] text-[#9ca3af]">
                    {movie.Year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <p className="text-[#9ca3af] font-serif text-lg italic text-center mt-12">
            No results for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
