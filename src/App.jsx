import { useState } from 'react';
import MovieCard from './MovieCard';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');



  return (
    <div style={{ backgroundImage: `url(src/assets/Rectangle.png),
    url(https://image.tmdb.org/t/p/original/${backgroundImageUrl}) `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
    }}>
      <Navbar />
      
      <MovieCard setBackgroundImage={setBackgroundImageUrl} />
    </div>
  );
}

export default App;
