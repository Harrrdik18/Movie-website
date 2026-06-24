import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { discoverMoviesThunk } from "../redux/slices/movieSlice";
import {
  selectDiscover,
  selectDiscoverLoading,
  selectDiscoverError,
  selectDiscoverTotalPages,
} from "../redux/selectors/movieSelectors";
import { getGenres } from "../services/omdbService";
import type { Genre } from "../types";

const countries = [
  { code: "", name: "All Countries" },
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
];

const Movies = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreList, setGenreList] = useState<Genre[]>([]);
  const [visibleGenreCount, setVisibleGenreCount] = useState(10);
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const movies = useSelector(selectDiscover);
  const loading = useSelector(selectDiscoverLoading);
  const error = useSelector(selectDiscoverError);
  const totalPages = useSelector(selectDiscoverTotalPages);

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    getGenres().then((data) => setGenreList(data.genres));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target as Node)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const params: Record<string, unknown> = {};
    if (year) params.year = year;
    if (genre) params.genre = genre;
    if (country) params.country = country;
    params.page = page;
    dispatch(discoverMoviesThunk(params));
  }, [page, sortBy, year, genre, country, dispatch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
    setPage(1);
  };

  const lastGenreRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleGenreCount((prev) => Math.min(prev + 5, genreList.length));
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
    },
    [genreList.length]
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = Math.min(totalPages, 500);
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(total - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 lg:pt-28 pb-16">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <h1 className="font-serif text-3xl lg:text-4xl text-[#f5f5f1] mb-8">
          Discover Films
        </h1>

        <div className="flex flex-wrap gap-4 mb-10 p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-transparent border border-[#2a2a2a] text-[#f5f5f1] text-sm px-3 py-2 focus:outline-none focus:border-[#c9774d] transition-colors cursor-pointer"
            >
              <option value="popularity.desc" className="bg-[#141414]">Popularity</option>
              <option value="vote_average.desc" className="bg-[#141414]">Rating</option>
              <option value="release_date.desc" className="bg-[#141414]">Release Date</option>
              <option value="revenue.desc" className="bg-[#141414]">Revenue</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">
              Year
            </label>
            <select
              value={year}
              onChange={handleYearChange}
              className="bg-transparent border border-[#2a2a2a] text-[#f5f5f1] text-sm px-3 py-2 focus:outline-none focus:border-[#c9774d] transition-colors cursor-pointer"
            >
              <option value="" className="bg-[#141414]">All Years</option>
              {years.map((y) => (
                <option key={y} value={y} className="bg-[#141414]">{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 relative" ref={genreDropdownRef}>
            <label className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">Genre</label>
            <button
              onClick={() => setGenreOpen(!genreOpen)}
              className="bg-transparent border border-[#2a2a2a] text-sm px-3 py-2 focus:outline-none focus:border-[#c9774d] transition-colors cursor-pointer min-w-[130px] text-left flex items-center justify-between gap-2"
            >
              <span className={genre ? "text-[#f5f5f1]" : "text-[#6b6b6b]"}>
                {genre || "All Genres"}
              </span>
              <span className={`text-[#9ca3af] text-[10px] transition-transform ${genreOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
            {genreOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#141414] border border-[#2a2a2a] shadow-xl z-50 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setGenre(""); setGenreOpen(false); setPage(1); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${!genre ? "text-[#c9774d] bg-[#1a1a1a]" : "text-[#9ca3af] hover:text-[#f5f5f1] hover:bg-[#1a1a1a]"}`}
                >
                  All Genres
                </button>
                {genreList.slice(0, visibleGenreCount).map((g, i) => (
                  <button
                    key={g.id}
                    ref={i === Math.min(visibleGenreCount, genreList.length) - 1 ? lastGenreRef : undefined}
                    onClick={() => { setGenre(g.name); setGenreOpen(false); setPage(1); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${genre === g.name ? "text-[#c9774d] bg-[#1a1a1a]" : "text-[#9ca3af] hover:text-[#f5f5f1] hover:bg-[#1a1a1a]"}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.15em] text-[#9ca3af]">Country</label>
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); setPage(1); }}
              className="bg-transparent border border-[#2a2a2a] text-[#f5f5f1] text-sm px-3 py-2 focus:outline-none focus:border-[#c9774d] transition-colors cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#141414]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-[#1a1a1a] border border-[#2a2a2a]" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-[#1a1a1a] w-3/4" />
                  <div className="h-3 bg-[#1a1a1a] w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-[#9ca3af] font-serif text-lg italic">{error}</p>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#9ca3af] font-serif text-xl italic">No films found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => navigate(`/movie/${movie.imdbID}`)}
                  className="group cursor-pointer"
                >
                  <div className="border border-[#2a2a2a] overflow-hidden transition-all duration-300 group-hover:border-[#c9774d] group-hover:-translate-y-1">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm text-[#f5f5f1] line-clamp-1 font-serif">
                      {movie.Title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-0.5">
                      <span className="uppercase tracking-[0.1em]">{movie.Year}</span>
                      {movie.imdbRating && (
                        <>
                          <span>·</span>
                          <span className="text-[#f5c518]">★ {movie.imdbRating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-12">
              {getPageNumbers().map((p, i) =>
                typeof p === "string" ? (
                  <span key={`ellipsis-${i}`} className="text-[#9ca3af] text-sm px-1">
                    …
                </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[36px] h-9 text-xs uppercase tracking-[0.1em] border transition-colors ${
                      p === page
                        ? "border-[#c9774d] text-[#c9774d] bg-[#c9774d]/10"
                        : "border-[#2a2a2a] text-[#9ca3af] hover:border-[#9ca3af]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;
