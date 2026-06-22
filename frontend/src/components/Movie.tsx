import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchMovieDetail } from "../redux/slices/movieSlice";
import {
  selectMovieDetails,
  selectSimilarMovies,
  selectDetailLoading,
  selectDetailError,
} from "../redux/selectors/movieSelectors";
import "./Movie.css";

const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const movieDetails = useSelector(selectMovieDetails);
  const similarMovies = useSelector(selectSimilarMovies);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectDetailError);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetail(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className="movie-loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="movie-error">{error}</div>;
  }

  if (!movieDetails) {
    return <div className="movie-error">No movie details found.</div>;
  }

  const formatRuntime = (minutes: string | number | undefined): string => {
    if (!minutes) return "N/A";
    const mins = typeof minutes === "string" ? parseInt(minutes) : minutes;
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return `${hours}h ${remaining}m`;
  };

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
    <div className="movie-page">
      <div
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), url(${movieDetails.Poster})`,
        }}
      >
        <div className="movie-hero-content movie-details-content">
          <div className="movie-poster">
            <img
              src={movieDetails.Poster}
              alt={movieDetails.Title}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/500x750?text=No+Poster";
              }}
            />
          </div>
          <div className="movie-info">
            <h1>{movieDetails.Title}</h1>
            {movieDetails.Plot && movieDetails.Plot !== "N/A" && (
              <p className="movie-overview">{movieDetails.Plot}</p>
            )}

            <div className="movie-meta">
              {movieDetails.Year && (
                <span className="movie-year">{movieDetails.Year}</span>
              )}
              <span className="movie-runtime">
                {movieDetails.Runtime || "N/A"}
              </span>
              <span className="movie-rating">
                ★ {movieDetails.imdbRating || "N/A"}
              </span>
            </div>

            {movieDetails.Genre && movieDetails.Genre !== "N/A" && (
              <div className="movie-genres">
                {movieDetails.Genre.split(", ").map((genre: string, index: number) => (
                  <span key={index} className="movie-genre">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="movie-details-grid">
              <div className="detail-item">
                <span className="detail-label">Director</span>
                <span className="detail-value">
                  {movieDetails.Director || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Writer</span>
                <span className="detail-value">
                  {movieDetails.Writer || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Awards</span>
                <span className="detail-value">
                  {movieDetails.Awards || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Language</span>
                <span className="detail-value">
                  {movieDetails.Language || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {movieDetails.Actors && (
        <div className="movie-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {movieDetails.Actors.split(", ").map((actor: string, index: number) => (
              <ActorCard key={index} actorName={actor} />
            ))}
          </div>
        </div>
      )}

      {similarMovies.length > 0 && (
        <div className="movie-section">
          <h2>Similar Movies</h2>
          <div className="similar-movies-grid">
            {similarMovies.map((movie) => (
              <div key={movie.imdbID} className="similar-movie-card">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x450?text=No+Poster";
                  }}
                />
                <div className="similar-movie-info">
                  <h3>{movie.Title}</h3>
                  <div className="similar-movie-meta">
                    <span>{movie.Year || "N/A"}</span>
                    <span>★ {movie.imdbRating || "N/A"}</span>
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

interface ActorCardProps {
  actorName: string;
}

const ActorCard = ({ actorName }: ActorCardProps) => {
  const [imgUrl, setImgUrl] = React.useState(
    "https://via.placeholder.com/200x300?text=Actor"
  );

  React.useEffect(() => {
    async function fetchImage() {
      try {
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            actorName
          )}&format=json&origin=*`
        );
        const searchData = await searchRes.json();
        if (
          searchData.query &&
          searchData.query.search &&
          searchData.query.search.length > 0
        ) {
          const pageTitle = searchData.query.search[0].title;
          const pageRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${encodeURIComponent(
              pageTitle
            )}&format=json&origin=*`
          );
          const pageData = await pageRes.json();
          const pages = pageData.query.pages;
          const pageId = Object.keys(pages)[0];
          const wikibaseId = pages[pageId]?.pageprops?.wikibase_item;
          if (wikibaseId) {
            const wikidataRes = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wikibaseId}&property=P18&format=json&origin=*`
            );
            const wikidataData = await wikidataRes.json();
            const claims = wikidataData.claims?.P18;
            if (claims && claims.length > 0) {
              const imageName = claims[0].mainsnak.datavalue.value;
              setImgUrl(
                `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
                  imageName
                )}`
              );
              return;
            }
          }
        }
      } catch (_e) {
        // Ignore and use placeholder
      }
      setImgUrl("https://via.placeholder.com/200x300?text=Actor");
    }
    fetchImage();
  }, [actorName]);

  return (
    <div className="cast-card">
      <img
        src={imgUrl}
        alt={actorName}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/200x300?text=No+Image";
        }}
      />
      <h3>{actorName}</h3>
      <p>Actor</p>
    </div>
  );
};

export default Movie;
