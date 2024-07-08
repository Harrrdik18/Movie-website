import React from 'react';
import MovieHeader from './MovieHeader';
import MovieInfo from './MovieInfo';
import MovieDescription from './MovieDescription';
import MovieCastAndCrew from './MovieCastAndCrew';
import RelatedMovies from './RelatedMovies';

const MovieDetail = ({ movie, relatedMovies }) => {
  return (
    <div className="movie-detail">
      <MovieHeader 
        image={movie.poster_path} 
        title={movie.original_title} 
        year={movie.release_date.split('-')[0]} 
        director={movie.director} // You might need to handle director data differently
      />
      <MovieInfo 
        duration={movie.runtime} 
        rating={movie.vote_average} 
        genre={movie.genres.map(genre => genre.name)} 
      />
      <MovieDescription description={movie.overview} />
      <MovieCastAndCrew cast={movie.cast} crew={movie.crew} /> // You might need to fetch this data separately
      <RelatedMovies movies={relatedMovies} onMovieSelect={movie.onMovieSelect} />
    </div>
  );
};

export default MovieDetail;
