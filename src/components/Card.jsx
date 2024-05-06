import React from 'react'

function Card({poster_path}) {
  return (
    <div><img className='tile'
    src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="Movie Poster" />
    </div>
  )
}

export default Card;