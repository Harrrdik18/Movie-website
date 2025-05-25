const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Helper function to make TMDB API requests
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`TMDB API Error: ${error.message}`);
  }
};

// Get trending movies
router.get("/trending/movie/:timeWindow", async (req, res) => {
  try {
    const { timeWindow } = req.params;
    const { language = "en-US" } = req.query;

    const data = await tmdbRequest(`/trending/movie/${timeWindow}`, {
      language,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular movies
router.get("/movie/popular", async (req, res) => {
  try {
    const { language = "en-US", page = 1 } = req.query;

    const data = await tmdbRequest("/movie/popular", { language, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top rated movies
router.get("/movie/top_rated", async (req, res) => {
  try {
    const { language = "en-US", page = 1 } = req.query;

    const data = await tmdbRequest("/movie/top_rated", { language, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming movies
router.get("/movie/upcoming", async (req, res) => {
  try {
    const { language = "en-US", page = 1 } = req.query;

    const data = await tmdbRequest("/movie/upcoming", { language, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie details
router.get("/movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "en-US" } = req.query;

    const data = await tmdbRequest(`/movie/${id}`, { language });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie credits
router.get("/movie/:id/credits", async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "en-US" } = req.query;

    const data = await tmdbRequest(`/movie/${id}/credits`, { language });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get similar movies
router.get("/movie/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "en-US", page = 1 } = req.query;

    const data = await tmdbRequest(`/movie/${id}/similar`, { language, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search movies
router.get("/search/movie", async (req, res) => {
  try {
    const { query, language = "en-US", page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const data = await tmdbRequest("/search/movie", { query, language, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Discover movies
router.get("/discover/movie", async (req, res) => {
  try {
    const {
      language = "en-US",
      sort_by = "popularity.desc",
      page = 1,
      with_genres,
      with_origin_country,
      primary_release_year,
    } = req.query;

    const params = { language, sort_by, page };
    if (with_genres) params.with_genres = with_genres;
    if (with_origin_country) params.with_origin_country = with_origin_country;
    if (primary_release_year)
      params.primary_release_year = primary_release_year;

    const data = await tmdbRequest("/discover/movie", params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Discover TV shows
router.get("/discover/tv", async (req, res) => {
  try {
    const {
      language = "en-US",
      sort_by = "popularity.desc",
      page = 1,
      with_genres,
      first_air_date_year,
    } = req.query;

    const params = { language, sort_by, page };
    if (with_genres) params.with_genres = with_genres;
    if (first_air_date_year) params.first_air_date_year = first_air_date_year;

    const data = await tmdbRequest("/discover/tv", params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie genres
router.get("/genre/movie/list", async (req, res) => {
  try {
    const { language = "en" } = req.query;

    const data = await tmdbRequest("/genre/movie/list", { language });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
