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
} from "./services/tmdbService";
import Carousel from "./components/Carousel";
import "./App.css";
import Navbar from "./components/Navbar";
import Movie from "./components/Movie";
import HeroSection from "./components/HeroSection";
import ContentRow from "./components/ContentRow";
import SearchBar from "./components/SearchBar";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
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
          getTrendingMovies("day", "en-US"),
          getPopularMovies("en-US"),
          getTopRatedMovies("en-US"),
          getUpcomingMovies("en-US"),
        ]);

        setTrendingMovies(trending.results);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setUpcomingMovies(upcoming.results);
        setBackgroundImageUrl(trending.results[0].backdrop_path);
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
      const response = await searchMovies(query, "en-US");
      setSearchResults(response.results);
      setShowSearch(true);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  return (
    <BrowserRouter>
      <div
        className="Container"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgb(0, 0, 0)), url(https://image.tmdb.org/t/p/original${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        <Navbar onSearch={handleSearch} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content">
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <div className="loading-text">Loading content...</div>
                    <div className="attribution">
                      This data is provided by TMDB API. The API might not be
                      loading because you are on Jio Fiber. Indian government
                      have banned TMDB API so some of the broadband services
                      don't support this, although this API works on Airtel and
                      other broadband services.
                    </div>
                  </div>
                ) : (
                  <>
                    {showSearch ? (
                      <div className="search-results">
                        <h2>Search Results</h2>
                        <div className="search-grid">
                          {searchResults.map((movie) => (
                            <div key={movie.id} className="search-item">
                              <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                              />
                              <h3>{movie.title}</h3>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <HeroSection movies={trendingMovies.slice(0, 5)} />
                        <div className="content-wrapper">
                          <ContentRow
                            title="Trending Now"
                            movies={trendingMovies}
                          />
                          <ContentRow
                            title="Popular on CineGlance"
                            movies={popularMovies}
                          />
                          <ContentRow
                            title="Top Rated"
                            movies={topRatedMovies}
                          />
                          <ContentRow
                            title="Coming Soon"
                            movies={upcomingMovies}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            }
          />
          <Route path="/movie/:id" element={<Movie />} />
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

export default App;
