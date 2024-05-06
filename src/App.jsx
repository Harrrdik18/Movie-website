import { useState } from 'react'
import MovieCard from './Data'
import './App.css'
import Carousel from './components/Carousel'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <MovieCard />
    </>
  )
}

export default App
