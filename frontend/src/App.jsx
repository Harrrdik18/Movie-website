import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./redux/selectors/userSelectors";
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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

        setTrendingMovies(trending.Search || []);
        setPopularMovies(popular.Search || []);
        setTopRatedMovies(topRated.Search || []);
        setUpcomingMovies(upcoming.Search || []);

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
      <div
        className="Container"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgb(0, 0, 0)), url(${backgroundImageUrl})`,
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
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                <div className="main-content">
                  {loading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      <div className="loading-text">Loading content...</div>
                      <div className="attribution">
                        This data is provided by OMDB API (Open Movie Database).
                        Loading movie and TV show information...
                      </div>
                    </div>
                  ) : (
                    <>
                      {showSearch ? (
                        <div className="search-results">
                          <h2>Search Results</h2>
                          <div className="search-grid">
                            {searchResults.map((movie) => (
                              <div key={movie.imdbID} className="search-item">
                                <img src={movie.Poster} alt={movie.Title} />
                                <h3>{movie.Title}</h3>
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
              </>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                <div className="main-content">
                  <Movie />
                </div>
              </>
            }
          />
          <Route path="/genre" element={<Genre />} />
          <Route path="/country" element={<Country />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-series" element={<TVSeries />} />

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
