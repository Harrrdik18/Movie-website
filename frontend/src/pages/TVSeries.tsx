import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchTVShows } from "../redux/slices/movieSlice";
import {
  selectTVShows,
  selectTVLoading,
  selectTVTotalPages,
} from "../redux/selectors/movieSelectors";

const TVSeries = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const shows = useSelector(selectTVShows);
  const loading = useSelector(selectTVLoading);
  const totalPages = useSelector(selectTVTotalPages);

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    const params: Record<string, unknown> = {};
    if (year) params.year = year;
    dispatch(fetchTVShows(params));
  }, [page, sortBy, year, dispatch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
    setPage(1);
  };

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
          TV Series
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
              <option value="first_air_date.desc" className="bg-[#141414]">Air Date</option>
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
        ) : shows.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#9ca3af] font-serif text-xl italic">No series found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {shows.map((show) => (
                <div
                  key={show.imdbID}
                  onClick={() => navigate(`/movie/${show.imdbID}`)}
                  className="group cursor-pointer"
                >
                  <div className="border border-[#2a2a2a] overflow-hidden transition-all duration-300 group-hover:border-[#c9774d] group-hover:-translate-y-1">
                    <img
                      src={show.Poster}
                      alt={show.Title}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm text-[#f5f5f1] line-clamp-1 font-serif">
                      {show.Title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-0.5">
                      <span className="uppercase tracking-[0.1em]">{show.Year}</span>
                      {show.imdbRating && (
                        <>
                          <span>·</span>
                          <span className="text-[#f5c518]">★ {show.imdbRating}</span>
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

export default TVSeries;
