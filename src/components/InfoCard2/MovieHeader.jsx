import React from 'react';

const MovieHeader = ({ image, title, year, director }) => {
  return (
    <div className="movie-header">
      <img src={`https://image.tmdb.org/t/p/w500${image}`} alt={title} />
      <div className="movie-header-info">
        <h1>{title}</h1>
        <p>{year}</p>
        <p>Directed by: {director}</p> // Handle this part based on available data
      </div>
    </div>
  );
};

export default MovieHeader;
