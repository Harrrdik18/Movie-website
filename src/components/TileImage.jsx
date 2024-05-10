import React from 'react'

function Card({poster_path, title}) {
  return (
    <div><img className='tile'
    src={`https://image.tmdb.org/t/p/original/${poster_path}`} title={title} />
    </div>
  )
}

export default Card;