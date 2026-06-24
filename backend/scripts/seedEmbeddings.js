require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const tmdb = require("../services/tmdbService");

const DATA_DIR = path.join(__dirname, "..", "data");
const EMBEDDINGS_PATH = path.join(DATA_DIR, "embeddings.json");

const CHUNK_SIZE = 10;
const DELAY_MS = 200;

const axios = require("axios");

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchPage(endpoint, page = 1) {
  const { data } = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
    params: { language: "en-US", page },
    timeout: 5000,
  });
  return data.results || [];
}

async function fetchAllMovies() {
  const seen = new Set();
  const movies = [];

  const endpoints = [];
  for (let p = 1; p <= 5; p++) {
    endpoints.push(`/movie/popular?page=${p}`);
    endpoints.push(`/movie/top_rated?page=${p}`);
  }
  endpoints.push("/trending/movie/week");

  const batches = [];
  for (let i = 0; i < endpoints.length; i += 5) {
    const batch = endpoints.slice(i, i + 5).map((ep) => {
      const [path, qs] = ep.split("?");
      const params = qs ? Object.fromEntries(new URLSearchParams(qs)) : {};
      return fetchPage(path, params.page || 1);
    });
    batches.push(Promise.allSettled(batch));
  }

  for (const batch of batches) {
    const results = await batch;
    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const m of result.value) {
          const id = m.id;
          if (!seen.has(id) && m.overview && m.overview.trim()) {
            seen.add(id);
            movies.push(m);
          }
        }
      }
    }
  }

  return movies;
}

async function buildEmbeddingText(movie) {
  const genres = (movie.genre_ids || [])
    .map((id) => {
      const map = {
        28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
        80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
        14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
        9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
        10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
      };
      return map[id] || null;
    })
    .filter(Boolean)
    .join(", ");

  return `Title: ${movie.title || movie.original_title || "Unknown"}
Year: ${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
Genres: ${genres || "N/A"}
Overview: ${movie.overview || ""}`;
}

async function embedText(text) {
  const OpenAI = require("openai");
  const openai = new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "https://github.com/your-repo",
      "X-Title": "CineGlance",
    },
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  console.log("Fetching movies from TMDB...");
  const movies = await fetchAllMovies();
  console.log(`Found ${movies.length} movies with plots.`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const embeddings = [];

  for (let i = 0; i < movies.length; i += CHUNK_SIZE) {
    const chunk = movies.slice(i, i + CHUNK_SIZE);

    const results = await Promise.allSettled(
      chunk.map(async (movie) => {
        const text = await buildEmbeddingText(movie);
        const vector = await embedText(text);
        const genres = (movie.genre_ids || [])
          .map((id) => {
            const map = {
              28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
              80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
              14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
              9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
              10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
            };
            return map[id] || null;
          })
          .filter(Boolean)
          .join(", ");

        return {
          id: `tmdb-${movie.id}`,
          title: movie.title || movie.original_title || "Unknown",
          year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          genre: genres,
          plot: movie.overview || "",
          imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
          embedding: vector,
        };
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        embeddings.push(result.value);
      }
    }

    const progress = Math.min(i + CHUNK_SIZE, movies.length);
    console.log(`Progress: ${progress}/${movies.length} movies embedded`);
  }

  fs.writeFileSync(EMBEDDINGS_PATH, JSON.stringify(embeddings, null, 2));
  console.log(`Done! Saved ${embeddings.length} embeddings to ${EMBEDDINGS_PATH}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
