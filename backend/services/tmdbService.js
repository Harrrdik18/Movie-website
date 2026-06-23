const axios = require("axios");

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE = process.env.TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";

const tmdbRequest = async (path, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      params: { language: "en-US", ...params },
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    throw new Error(`TMDB API Error: ${error.message}`);
  }
};

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const mapGenreIds = (ids = []) => {
  return ids.map((id) => GENRE_MAP[id]).filter(Boolean).join(", ");
};

const tmdbToMovieEntity = (movie) => {
  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`
    : "N/A";

  return {
    imdbID: movie.imdb_id || `tmdb-${movie.id}`,
    Title: movie.title || movie.original_title || "N/A",
    Year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
    Poster: poster,
    Backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}`
      : "",
    Type: "movie",
    imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    Plot: movie.overview || "",
    Runtime: movie.runtime ? `${movie.runtime} min` : undefined,
    Genre: mapGenreIds(movie.genre_ids || movie.genres?.map((g) => g.id) || []),
    Director: "",
    Writer: "",
    Actors: "",
    Language: "",
    Country: "",
    Awards: "",
    Rated: "",
    Released: movie.release_date || "",
    Ratings: movie.vote_average
      ? [{ Source: "Internet Movie Database", Value: `${movie.vote_average.toFixed(1)}/10` }]
      : [],
    Metascore: "",
    imdbVotes: movie.vote_count ? movie.vote_count.toString() : "",
    BoxOffice: "",
    Production: "",
    Website: "",
    Cast: [],
  };
};

const enrichWithCredits = (entity, credits) => {
  if (!credits || !credits.cast) return entity;

  entity.Actors = credits.cast.slice(0, 5).map((c) => c.name).join(", ");

  entity.Cast = credits.cast.slice(0, 10).map((c) => ({
    name: c.name,
    character: c.character || "",
    profilePath: c.profile_path
      ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}`
      : null,
  }));

  const director = credits.crew?.find((c) => c.job === "Director");
  if (director) entity.Director = director.name;

  const writers = credits.crew?.filter((c) =>
    ["Writer", "Screenplay", "Story"].includes(c.job)
  );
  if (writers?.length) entity.Writer = writers.map((w) => w.name).join(", ");

  return entity;
};

exports.getTrendingMovies = async () => {
  const data = await tmdbRequest("/trending/movie/week");
  return data.results || [];
};

exports.getPopularMovies = async () => {
  const data = await tmdbRequest("/movie/popular");
  return data.results || [];
};

exports.getTopRatedMovies = async () => {
  const data = await tmdbRequest("/movie/top_rated");
  return data.results || [];
};

exports.getUpcomingMovies = async () => {
  const data = await tmdbRequest("/movie/upcoming");
  return data.results || [];
};

exports.searchMovies = async (query, page = 1) => {
  const data = await tmdbRequest("/search/movie", { query, page });
  return { results: data.results || [], totalResults: data.total_results || 0 };
};

exports.discoverMovies = async (params = {}) => {
  const queryParams = {};
  if (params.genre) {
    const genreEntry = Object.entries(GENRE_MAP).find(
      ([, name]) => name.toLowerCase() === params.genre.toLowerCase()
    );
    if (genreEntry) queryParams.with_genres = genreEntry[0];
  }
  if (params.year) queryParams.year = params.year;
  if (params.page) queryParams.page = params.page;

  const data = await tmdbRequest("/discover/movie", queryParams);
  return { results: data.results || [], totalResults: data.total_results || 0 };
};

exports.discoverTVShows = async (params = {}) => {
  const queryParams = {};
  if (params.year) {
    queryParams.first_air_date_year = params.year;
  }
  if (params.page) queryParams.page = params.page;

  const data = await tmdbRequest("/discover/tv", queryParams);
  return { results: data.results || [], totalResults: data.total_results || 0 };
};

exports.getMovieDetails = async (id) => {
  let tmdbMovieId;

  if (id.startsWith("tmdb-")) {
    tmdbMovieId = id.replace("tmdb-", "");
  } else {
    const findData = await tmdbRequest(`/find/${id}`, {
      external_source: "imdb_id",
    });
    const tmdbResults = findData.movie_results;
    if (!tmdbResults || tmdbResults.length === 0) {
      throw new Error("Movie not found on TMDB");
    }
    tmdbMovieId = tmdbResults[0].id;
  }

  const detailData = await tmdbRequest(`/movie/${tmdbMovieId}`, {
    append_to_response: "credits",
  });

  let entity = tmdbToMovieEntity(detailData);
  entity = enrichWithCredits(entity, detailData.credits);

  return entity;
};

exports.getSimilarMovies = async (id) => {
  try {
    let tmdbMovieId;

    if (id.startsWith("tmdb-")) {
      tmdbMovieId = id.replace("tmdb-", "");
    } else {
      const findData = await tmdbRequest(`/find/${id}`, {
        external_source: "imdb_id",
      });
      const tmdbResults = findData.movie_results;
      if (!tmdbResults || tmdbResults.length === 0) return [];
      tmdbMovieId = tmdbResults[0].id;
    }

    const similarData = await tmdbRequest(
      `/movie/${tmdbMovieId}/recommendations`
    );
    return (similarData.results || []).slice(0, 12);
  } catch {
    return [];
  }
};

exports.tmdbToMovieEntity = tmdbToMovieEntity;
