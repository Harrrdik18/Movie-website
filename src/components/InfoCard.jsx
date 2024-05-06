import React from 'react'

function InfoCard({movies}) {

const movie = movies[3];
  return (
    <>
    <div >
        <h2>{movie.title}</h2>
        <span>{`Rating: ${movie.vote_average}  `}</span>
        <span>{`Release date : ${movie.release_date}`}</span>
        <p>{movie.overview}</p>
        
 </div>

 </>
  )
}

export default InfoCard