import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Carousel from './components/Carousel';
import './App.css';
import Navbar from './components/Navbar';
import Movie from './components/Movie';

function App() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = import.meta.env.VITE_AUTH;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
          headers: {
            Authorization: authToken,
          },
        });
        setInfo(response.data.results);
        setBackgroundImageUrl(response.data.results[3].backdrop_path);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authToken]);

  return (
    <BrowserRouter>
      <div
        className="Container"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.341), rgb(0, 0, 0)), url(https://image.tmdb.org/t/p/original/iJaSpQNZ8GsqVDWfbCXmyZQXZ5l.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="carousel-cards">
                {loading && <div>Loading ...</div>}
                {!loading && (
                  <Carousel movies={info} setBackgroundImageUrl={setBackgroundImageUrl} />
                )}
              </div>
            }
          />
          <Route path="/movie/:id" element={<Movie />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
