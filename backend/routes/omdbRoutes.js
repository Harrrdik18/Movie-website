const express = require("express");
const axios = require("axios");
const router = express.Router();

const OMDB_BASE_URL = process.env.OMDB_BASE_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Helper function to make OMDB API requests
const omdbRequest = async (params = {}) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`OMDB API Error: ${error.message}`);
  }
};

// Search movies/series by title
router.get("/search", async (req, res) => {
  try {
    const { s: query, type = "", y: year, page = 1 } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Search query parameter 's' is required" });
    }

    const params = { s: query, page };
    if (type) params.type = type; // movie, series, episode
    if (year) params.y = year;

    const data = await omdbRequest(params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie/series details by ID or title
router.get("/details", async (req, res) => {
  try {
    const {
      i: imdbId,
      t: title,
      type = "",
      y: year,
      plot = "short",
    } = req.query;

    if (!imdbId && !title) {
      return res.status(400).json({
        error: "Either 'i' (IMDb ID) or 't' (title) parameter is required",
      });
    }

    const params = { plot };
    if (imdbId) params.i = imdbId;
    if (title) params.t = title;
    if (type) params.type = type;
    if (year) params.y = year;

    const data = await omdbRequest(params);
    console.log("OMDB /details response:", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular movies (using a predefined list of popular movie titles)
router.get("/popular/movies", async (req, res) => {
  try {
    const popularMovies = [
      "The Shawshank Redemption",
      "The Godfather",
      "The Dark Knight",
      "Pulp Fiction",
      "Forrest Gump",
      "Inception",
      "The Matrix",
      "Goodfellas",
      "The Lord of the Rings",
      "Star Wars",
    ];

    const moviePromises = popularMovies.map((title) =>
      omdbRequest({ t: title, type: "movie" })
    );

    const movies = await Promise.all(moviePromises);
    const validMovies = movies.filter((movie) => movie.Response === "True");

    res.json({
      Search: validMovies,
      totalResults: validMovies.length.toString(),
      Response: "True",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular TV series (using a predefined list of popular series titles)
router.get("/popular/series", async (req, res) => {
  try {
    const popularSeries = [
      "Breaking Bad",
      "Game of Thrones",
      "The Office",
      "Friends",
      "Stranger Things",
      "The Crown",
      "Sherlock",
      "House of Cards",
      "Narcos",
      "The Walking Dead",
    ];

    const seriesPromises = popularSeries.map((title) =>
      omdbRequest({ t: title, type: "series" })
    );

    const series = await Promise.all(seriesPromises);
    const validSeries = series.filter((show) => show.Response === "True");

    res.json({
      Search: validSeries,
      totalResults: validSeries.length.toString(),
      Response: "True",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movies by year
router.get("/movies/year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const { page = 1 } = req.query;

    // Search for movies from a specific year using common search terms
    const searchTerms = ["action", "drama", "comedy", "thriller", "horror"];
    const randomTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const data = await omdbRequest({
      s: randomTerm,
      type: "movie",
      y: year,
      page,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movies by genre (limited functionality in OMDB)
router.get("/movies/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1 } = req.query;

    // OMDB doesn't have direct genre filtering, so we search by genre name
    const data = await omdbRequest({
      s: genre,
      type: "movie",
      page,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent movies (search by current year)
router.get("/movies/recent", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const { page = 1 } = req.query;

    const data = await omdbRequest({
      s: "movie",
      type: "movie",
      y: currentYear,
      page,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
