import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from "../services/omdbService";
import "./Movie.css";

const Movie = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [detailsRes, creditsRes, similarRes] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getSimilarMovies(id),
        ]);

        setMovieDetails(detailsRes);
        setCast(creditsRes.cast || []);
        setSimilarMovies(similarRes.Search || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return <div className="movie-loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="movie-error">{error}</div>;
  }

  if (!movieDetails) {
    return <div className="movie-error">No movie details found.</div>;
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="movie-page">
      {/* Hero Section */}
      <div
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), url(${movieDetails.Poster})`,
        }}
      >
        <div className="movie-hero-content">
          <div className="movie-poster">
            <img
              src={movieDetails.Poster}
              alt={movieDetails.Title}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x750?text=No+Poster";
              }}
            />
          </div>
          <div className="movie-info">
            <h1>{movieDetails.Title}</h1>
            {movieDetails.Plot && (
              <p className="movie-tagline">{movieDetails.Plot}</p>
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

            {movieDetails.Genre && (
              <div className="movie-genres">
                {movieDetails.Genre.split(", ").map((genre, index) => (
                  <span key={index} className="movie-genre">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movieDetails.Plot && (
              <p className="movie-overview">{movieDetails.Plot}</p>
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

      {/* Cast Section */}
      {movieDetails.Actors && (
        <div className="movie-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {movieDetails.Actors.split(", ").map((actor, index) => (
              <ActorCard key={index} actorName={actor} />
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies Section */}
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
                    e.target.src =
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

const ActorCard = ({ actorName }) => {
  const [imgUrl, setImgUrl] = React.useState(
    "https://via.placeholder.com/200x300?text=Actor"
  );

  React.useEffect(() => {
    async function fetchImage() {
      try {
        // Step 1: Get Wikipedia page for actor
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
          // Step 2: Get Wikidata entity ID from Wikipedia page
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
            // Step 3: Get image from Wikidata
            const wikidataRes = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wikibaseId}&property=P18&format=json&origin=*`
            );
            const wikidataData = await wikidataRes.json();
            const claims = wikidataData.claims?.P18;
            if (claims && claims.length > 0) {
              // P18 is the image property
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
      } catch (e) {
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
          e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
        }}
      />
      <h3>{actorName}</h3>
      <p>Actor</p>
    </div>
  );
};

export default Movie;
