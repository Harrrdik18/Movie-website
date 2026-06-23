import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchMovieDetail } from "../redux/slices/movieSlice";
import {
  selectMovieDetails,
  selectSimilarMovies,
  selectDetailLoading,
  selectDetailError,
} from "../redux/selectors/movieSelectors";

const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const movieDetails = useSelector(selectMovieDetails);
  const similarMovies = useSelector(selectSimilarMovies);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectDetailError);

  useEffect(() => {
    if (id) dispatch(fetchMovieDetail(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-5xl px-6">
          <div className="h-10 bg-[#1a1a1a] w-2/3 mx-auto" />
          <div className="h-80 bg-[#1a1a1a] w-60 mx-auto" />
          <div className="space-y-3">
            <div className="h-4 bg-[#1a1a1a] w-full" />
            <div className="h-4 bg-[#1a1a1a] w-5/6" />
            <div className="h-4 bg-[#1a1a1a] w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#9ca3af] font-serif text-xl italic">{error}</p>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#9ca3af] font-serif text-xl italic">No film found.</p>
      </div>
    );
  }

  const formatCurrency = (amount: string | number | undefined): string => {
    if (!amount) return "N/A";
    const num = typeof amount === "string" ? parseInt(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 lg:pt-20">
      <div className="relative min-h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={movieDetails.Poster}
            alt={movieDetails.Title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/1200x800?text=No+Poster";
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="hidden lg:block flex-shrink-0 w-72">
              <div className="border border-[#2a2a2a] overflow-hidden">
                <img
                  src={movieDetails.Poster}
                  alt={movieDetails.Title}
                  className="w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x450?text=No+Poster";
                  }}
                />
              </div>
            </div>

            <div className="flex-1 max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl text-[#f5f5f1] leading-tight">
                {movieDetails.Title}
              </h1>

              <div className="flex items-center flex-wrap gap-4 mt-4 text-sm text-[#9ca3af] uppercase tracking-[0.1em]">
                {movieDetails.Year && <span>{movieDetails.Year}</span>}
                <span className="w-px h-3 bg-[#2a2a2a]" />
                <span>{movieDetails.Runtime || "N/A"}</span>
                <span className="w-px h-3 bg-[#2a2a2a]" />
                <span className="text-[#f5c518]">★ {movieDetails.imdbRating || "N/A"}</span>
              </div>

              {movieDetails.Genre && movieDetails.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {movieDetails.Genre.split(", ").map((genre) => (
                    <span
                      key={genre}
                      className="text-xs uppercase tracking-[0.15em] text-[#9ca3af] border border-[#2a2a2a] px-3 py-1"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {movieDetails.Plot && movieDetails.Plot !== "N/A" && (
                <p className="mt-6 text-[#9ca3af] text-base leading-relaxed font-light italic border-l-2 border-[#c9774d] pl-4">
                  {movieDetails.Plot}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Director", value: movieDetails.Director },
                { label: "Writer", value: movieDetails.Writer },
                { label: "Awards", value: movieDetails.Awards },
                { label: "Language", value: movieDetails.Language },
                { label: "Country", value: movieDetails.Country },
                { label: "Released", value: movieDetails.Released },
                { label: "Rated", value: movieDetails.Rated },
                { label: "Box Office", value: formatCurrency(movieDetails.BoxOffice) },
              ].map(
                (item) =>
                  item.value &&
                  item.value !== "N/A" && (
                    <div key={item.label} className="border border-[#2a2a2a] p-4">
                      <span className="text-[#9ca3af] text-xs uppercase tracking-[0.15em] block">
                        {item.label}
                      </span>
                      <span className="text-[#f5f5f1] text-sm mt-1 block">
                        {item.value}
                      </span>
                    </div>
                  )
              )}
            </div>

            {movieDetails.Actors && (
              <div className="mt-12 lg:mt-16">
                <h2 className="font-serif text-2xl text-[#f5f5f1] mb-6 flex items-center gap-4">
                  Cast
                  <span className="flex-1 h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movieDetails.Actors.split(", ").map((actor) => (
                    <div
                      key={actor}
                      className="border border-[#2a2a2a] p-3 text-center hover:border-[#c9774d] transition-colors"
                    >
                      <div className="w-full aspect-[2/3] bg-[#1a1a1a] flex items-center justify-center mb-2">
                        <span className="text-[#9ca3af] text-xs uppercase tracking-[0.15em]">
                          Photo
                        </span>
                      </div>
                      <span className="text-[#f5f5f1] text-xs uppercase tracking-[0.1em]">
                        {actor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
              <div className="border border-[#2a2a2a] p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-4">
                  Ratings
                </h3>
                <div className="space-y-3">
                  {movieDetails.Ratings.map((rating) => (
                    <div key={rating.Source} className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-[0.1em] text-[#9ca3af]">
                        {rating.Source}
                      </span>
                      <span className="text-sm text-[#f5f5f1] font-medium">
                        {rating.Value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movieDetails.Awards && movieDetails.Awards !== "N/A" && (
              <div className="mt-6 border border-[#2a2a2a] p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">
                  Awards
                </h3>
                <p className="text-sm text-[#f5f5f1] leading-relaxed">
                  {movieDetails.Awards}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#2a2a2a]">
          <h2 className="font-serif text-2xl text-[#f5f5f1] mb-8 flex items-center gap-4">
            Related Films
            <span className="flex-1 h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {similarMovies.map((movie) => (
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                  />
                </div>
                <div className="mt-2">
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
        </div>
      )}
    </div>
  );
};

export default Movie;
