const express = require("express");
const axios = require("axios");
const router = express.Router();
const tmdb = require("../services/tmdbService");

const OMDB_BASE_URL = process.env.OMDB_BASE_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const omdbRequest = async (params = {}) => {
  const response = await axios.get(OMDB_BASE_URL, {
    params: { apikey: OMDB_API_KEY, ...params },
    timeout: 5000,
  });
  return response.data;
};

const formatAsSearchResponse = (movies) => ({
  Search: movies,
  totalResults: String(movies.length),
  Response: "True",
});

const tryTMDB = async (fn, fallbackFn) => {
  try {
    return await fn();
  } catch {
    return await fallbackFn();
  }
};

router.get("/trending", async (req, res) => {
  try {
    const data = await tryTMDB(
      async () => {
        const movies = await tmdb.getTrendingMovies();
        return formatAsSearchResponse(movies.map(tmdb.tmdbToMovieEntity));
      },
      async () => await omdbRequest({ s: "movie", type: "movie", page: 1 })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/popular", async (req, res) => {
  try {
    const data = await tryTMDB(
      async () => {
        const movies = await tmdb.getPopularMovies();
        return formatAsSearchResponse(movies.map(tmdb.tmdbToMovieEntity));
      },
      async () => await omdbRequest({ s: "movie", type: "movie", page: 1 })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top-rated", async (req, res) => {
  try {
    const data = await tryTMDB(
      async () => {
        const movies = await tmdb.getTopRatedMovies();
        return formatAsSearchResponse(movies.map(tmdb.tmdbToMovieEntity));
      },
      async () => await omdbRequest({ s: "movie", type: "movie", page: 1 })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const data = await tryTMDB(
      async () => {
        const movies = await tmdb.getUpcomingMovies();
        return formatAsSearchResponse(movies.map(tmdb.tmdbToMovieEntity));
      },
      async () => {
        const year = new Date().getFullYear();
        return await omdbRequest({ s: "movie", type: "movie", y: year, page: 1 });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q = "", page = 1 } = req.query;
    if (!q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const data = await tryTMDB(
      async () => {
        const { results } = await tmdb.searchMovies(q, page);
        const transformed = results.map(tmdb.tmdbToMovieEntity);
        return {
          Search: transformed,
          totalResults: String(results.length),
          Response: "True",
        };
      },
      async () => await omdbRequest({ s: q, type: "movie", page })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/discover", async (req, res) => {
  try {
    const { genre, year, page = 1 } = req.query;

    const data = await tryTMDB(
      async () => {
        const { results } = await tmdb.discoverMovies({
          genre,
          year,
          page: Number(page),
        });
        const transformed = results.map(tmdb.tmdbToMovieEntity);
        return {
          Search: transformed,
          totalResults: String(results.length),
          Response: "True",
        };
      },
      async () => {
        if (genre) return await omdbRequest({ s: genre, type: "movie", page });
        if (year) {
          const terms = ["action", "drama", "comedy", "thriller", "horror"];
          const term = terms[Math.floor(Math.random() * terms.length)];
          return await omdbRequest({ s: term, type: "movie", y: year, page });
        }
        return await omdbRequest({ s: "movie", type: "movie", page });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tv", async (req, res) => {
  try {
    const { year, page = 1 } = req.query;

    const data = await tryTMDB(
      async () => {
        const { results } = await tmdb.discoverTVShows({
          year,
          page: Number(page),
        });
        const transformed = results.map((s) => {
          const poster = s.poster_path
            ? `${process.env.TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p"}/w500${s.poster_path}`
            : "N/A";
          return {
            imdbID: `tv-${s.id}`,
            Title: s.name || s.original_name || "N/A",
            Year: s.first_air_date ? s.first_air_date.split("-")[0] : "N/A",
            Poster: poster,
            Type: "series",
            imdbRating: s.vote_average ? s.vote_average.toFixed(1) : "N/A",
          };
        });
        return {
          Search: transformed,
          totalResults: String(results.length),
          Response: "True",
        };
      },
      async () => {
        if (year) return await omdbRequest({ s: "series", type: "series", y: year, page });
        return await omdbRequest({ s: "series", type: "series", page });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await tryTMDB(
      async () => await tmdb.getMovieDetails(id),
      async () => {
        if (!id.startsWith("tt")) {
          return { Response: "False", Error: "Movie not found" };
        }
        return await omdbRequest({ i: id, plot: "full" });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await tryTMDB(
      async () => {
        const movies = await tmdb.getSimilarMovies(id);
        return formatAsSearchResponse(movies.map(tmdb.tmdbToMovieEntity));
      },
      async () => {
        if (!id.startsWith("tt")) {
          return { Search: [], totalResults: "0", Response: "True" };
        }
        return await omdbRequest({ s: id, type: "movie", page: 1 });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/country/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const countryMap = {
      US: "en", GB: "en", IN: "hi", JP: "ja", KR: "ko",
      FR: "fr", DE: "de", IT: "it", ES: "es", BR: "pt",
    };
    const lang = countryMap[code] || "en";

    const data = await tryTMDB(
      async () => {
        const { results } = await tmdb.discoverMovies({});
        const filtered = results.filter(
          (m) => m.original_language === lang
        );
        return formatAsSearchResponse(
          (filtered.length ? filtered : results).map(tmdb.tmdbToMovieEntity)
        );
      },
      async () => {
        const nameMap = {
          US: "American", GB: "British", IN: "Indian", JP: "Japanese",
          KR: "Korean", FR: "French", DE: "German", IT: "Italian",
          ES: "Spanish", BR: "Brazilian",
        };
        return await omdbRequest({
          s: nameMap[code] || code,
          type: "movie",
          page: 1,
        });
      }
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/genres", async (req, res) => {
  const genres = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" }, { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" }, { id: 36, name: "History" },
    { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" }, { id: 53, name: "Thriller" },
    { id: 10752, name: "War" }, { id: 37, name: "Western" },
  ];
  res.json({ genres });
});

module.exports = router;
