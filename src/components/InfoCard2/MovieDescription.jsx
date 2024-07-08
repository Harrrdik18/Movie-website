import React from 'react';

const MovieDescription = ({ description }) => {
  return (
    <div className="movie-description">
      <h2>Description</h2>
      <p>{description}</p>
    </div>
  );
};

export default MovieDescription;
