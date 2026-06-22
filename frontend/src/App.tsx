import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { selectIsAuthenticated } from "./redux/selectors/userSelectors";
import {
  selectTrending,
  selectPopular,
  selectTopRated,
  selectUpcoming,
  selectHomeLoading,
  selectBackgroundImageUrl,
  selectSearchResults,
} from "./redux/selectors/movieSelectors";
import {
  fetchHomeData,
  searchMoviesThunk,
  clearSearch,
} from "./redux/slices/movieSlice";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Movie from "./components/Movie";
import HeroSection from "./components/HeroSection";
import ContentRow from "./components/ContentRow";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const trendingMovies = useSelector(selectTrending);
  const popularMovies = useSelector(selectPopular);
  const topRatedMovies = useSelector(selectTopRated);
  const upcomingMovies = useSelector(selectUpcoming);
  const loading = useSelector(selectHomeLoading);
  const backgroundImageUrl = useSelector(selectBackgroundImageUrl);
  const searchResults = useSelector(selectSearchResults);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      dispatch(clearSearch());
      setShowSearch(false);
      return;
    }

    dispatch(searchMoviesThunk(query));
    setShowSearch(true);
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
