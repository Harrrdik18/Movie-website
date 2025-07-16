import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from "./services/omdbService";
import "./AppAlt.css";
import NavbarAlt from "./components/NavbarAlt";
import Movie from "./components/Movie";
import HeroSectionAlt from "./components/HeroSectionAlt";
import ContentRowAlt from "./components/ContentRowAlt";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function AppAlt() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

        // OMDB returns data in Search array format
        setTrendingMovies(trending.Search || []);
        setPopularMovies(popular.Search || []);
        setTopRatedMovies(topRated.Search || []);
        setUpcomingMovies(upcoming.Search || []);

        // Set background image from first movie poster (OMDB uses Poster field)
        if (trending.Search && trending.Search.length > 0) {
          setBackgroundImageUrl(trending.Search[0].Poster);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Update login status when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const response = await searchMovies(query);
      setSearchResults(response.Search || []);
      setShowSearch(true);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container-alt">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarAlt onSearch={handleSearch} isLoggedIn={isLoggedIn} />
                <div className="main-content-alt">
                  {loading ? (
                    <div className="loading-alt">
                      <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                      </div>
                      <div className="loading-text-alt">
                        <h2>Loading CineVault</h2>
                        <p>Discovering amazing movies and series for you...</p>
                      </div>
                      <div className="loading-progress">
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {showSearch ? (
                        <div className="search-results-alt">
                          <div className="search-header">
                            <h2>Search Results</h2>
                            <button
                              className="clear-search"
                              onClick={() => setShowSearch(false)}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              Clear
                            </button>
                          </div>
                          <div className="search-grid-alt">
                            {searchResults.map((movie) => (
                              <div key={movie.imdbID} className="search-card">
                                <div className="search-card-image">
                                  <img src={movie.Poster} alt={movie.Title} />
                                  <div className="search-card-overlay">
                                    <button className="search-play-btn">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <polygon points="5,3 19,12 5,21"></polygon>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="search-card-content">
                                  <h3>{movie.Title}</h3>
                                  <div className="search-card-meta">
                                    <span>{movie.Year}</span>
                                    <span>{movie.Type}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <HeroSectionAlt movies={trendingMovies.slice(0, 5)} />
                          <div className="content-wrapper-alt">
                            <ContentRowAlt
                              title="🔥 Trending Now"
                              movies={trendingMovies}
                            />
                            <ContentRowAlt
                              title="⭐ Popular on CineVault"
                              movies={popularMovies}
                            />
                            <ContentRowAlt
                              title="🏆 Top Rated"
                              movies={topRatedMovies}
                            />
                            <ContentRowAlt
                              title="🎬 Coming Soon"
                              movies={upcomingMovies}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <>
                <NavbarAlt onSearch={handleSearch} isLoggedIn={isLoggedIn} />
                <div className="main-content-alt">
                  <Movie />
                </div>
              </>
            }
          />
          <Route path="/genre" element={<Genre />} />
          <Route path="/country" element={<Country />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-series" element={<TVSeries />} />

          {/* Authentication Routes */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppAlt;
