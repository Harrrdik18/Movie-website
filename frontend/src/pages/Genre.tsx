import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchGenres, fetchMoviesByGenre } from "../redux/slices/movieSlice";
import {
  selectGenres,
  selectGenreMovies,
  selectGenreLoading,
} from "../redux/selectors/movieSelectors";

const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const genres = useSelector(selectGenres);
  const movies = useSelector(selectGenreMovies);
  const loading = useSelector(selectGenreLoading);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
    dispatch(fetchMoviesByGenre(genreName));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 lg:pt-28 flex">
      <aside className="w-56 lg:w-64 flex-shrink-0 border-r border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="p-6">
          <h2 className="font-serif text-xl text-[#f5f5f1] mb-6">Genres</h2>
          <div className="flex flex-col gap-1">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.name)}
                className={`text-left text-sm py-2 px-3 transition-colors border-l-2 ${
                  selectedGenre === genre.name
                    ? "border-[#c9774d] text-[#c9774d] bg-[#c9774d]/5"
                    : "border-transparent text-[#9ca3af] hover:text-[#f5f5f1] hover:border-[#2a2a2a]"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-[#1a1a1a] border border-[#2a2a2a]" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-[#1a1a1a] w-3/4" />
                  <div className="h-3 bg-[#1a1a1a] w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : selectedGenre ? (
          movies.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-[#9ca3af] font-serif text-lg italic">
                No films found in this genre.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
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
                    <span className="text-xs uppercase tracking-[0.1em] text-[#9ca3af]">
                      {movie.Year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#9ca3af] font-serif text-xl italic">
              Select a genre to browse films
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Genre;
