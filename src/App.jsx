import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Carousel from './components/Carousel';
import './App.css';
import Navbar from './components/Navbar';
import Movie from './components/Movie';
import HeroSection from './components/HeroSection';
import ContentRow from './components/ContentRow';
import SearchBar from './components/SearchBar';
import Genre from './pages/Genre';
import Country from './pages/Country';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';

function App() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const authToken = import.meta.env.VITE_AUTH;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
            headers: { Authorization: authToken },
          }),
          axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US', {
            headers: { Authorization: authToken },
          }),
          axios.get('https://api.themoviedb.org/3/movie/top_rated?language=en-US', {
            headers: { Authorization: authToken },
          }),
          axios.get('https://api.themoviedb.org/3/movie/upcoming?language=en-US', {
            headers: { Authorization: authToken },
          }),
        ]);

        setTrendingMovies(trending.data.results);
        setPopularMovies(popular.data.results);
        setTopRatedMovies(topRated.data.results);
        setUpcomingMovies(upcoming.data.results);
        setBackgroundImageUrl(trending.data.results[0].backdrop_path);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [authToken]);

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US`,
        {
          headers: { Authorization: authToken },
        }
      );
      setSearchResults(response.data.results);
      setShowSearch(true);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  return (
    <BrowserRouter>
      <div
        className="Container"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgb(0, 0, 0)), url(https://image.tmdb.org/t/p/original${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content">
                {loading ? (
                  <div className="loading">Loading...</div>
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
                          <ContentRow title="Trending Now" movies={trendingMovies} />
                          <ContentRow title="Popular on CineGlance" movies={popularMovies} />
                          <ContentRow title="Top Rated" movies={topRatedMovies} />
                          <ContentRow title="Coming Soon" movies={upcomingMovies} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
