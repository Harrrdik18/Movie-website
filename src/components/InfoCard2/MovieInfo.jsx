import React from 'react';

const MovieInfo = ({ duration, rating, genre }) => {
  return (
    <div className="movie-info">
      <p>Duration: {duration} min</p>
      <p>Rating: {rating}</p>
      <p>Genre: {genre.join(', ')}</p>
    </div>
  );
};

export default MovieInfo;
