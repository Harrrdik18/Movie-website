import React from 'react';

const RelatedMovies = ({ movies, onMovieSelect }) => {
  return (
    <div className="related-movies">
      <h2>Related Movies</h2>
      <div className="related-movies-list">
        {movies.map((movie) => (
          <div key={movie.id} onClick={() => onMovieSelect(movie)}>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.original_title} />
            <p>{movie.original_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedMovies;
