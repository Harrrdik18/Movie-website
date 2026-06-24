import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { selectIsAuthenticated } from "./redux/selectors/userSelectors";
import {
  selectTrending,
  selectPopular,
  selectTopRated,
  selectUpcoming,
  selectHomeLoading,
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

import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";
import ChatAssistant from "./components/ChatAssistant";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const trendingMovies = useSelector(selectTrending);
  const popularMovies = useSelector(selectPopular);
  const topRatedMovies = useSelector(selectTopRated);
  const upcomingMovies = useSelector(selectUpcoming);
  const loading = useSelector(selectHomeLoading);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      dispatch(clearSearch());
      return;
    }
    dispatch(searchMoviesThunk(query));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div
        className="Container"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #141414 0%, #0a0a0a 70%)",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
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
                    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
                      <div className="animate-pulse space-y-4 w-64">
                        <div className="h-6 bg-[#1a1a1a] rounded w-3/4 mx-auto" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-full" />
                        <div className="h-4 bg-[#1a1a1a] rounded w-5/6" />
                      </div>
                      <p className="text-[#9ca3af] text-sm uppercase tracking-[0.15em]">
                        Loading…
                      </p>
                    </div>
                  ) : (
                    <>
                      <HeroSection movies={trendingMovies.slice(0, 5)} />
                      <div className="bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] -mt-32 relative z-10">
                        <ContentRow
                          title="Trending Now"
                          movies={trendingMovies}
                        />
                        <ContentRow
                          title="Popular"
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
          <Route
            path="/movies"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                <Movies />
              </>
            }
          />
          <Route
            path="/tv-series"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                <TVSeries />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                {isAuthenticated ? <Navigate to="/" /> : <Login />}
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                {isAuthenticated ? <Navigate to="/" /> : <Register />}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar onSearch={handleSearch} />
                {isAuthenticated ? <Profile /> : <Navigate to="/login" />}
              </>
            }
          />
        </Routes>
        <ChatAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;
