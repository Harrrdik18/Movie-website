import React from 'react';
import './InfoCard.css';

const InfoCard = ({ movie }) => {
  const {
    poster_path,
    original_title,
    release_date,
    runtime,
    vote_average,
    genres,
    overview,
    production_companies,
    cast = [],
  } = movie;

  return (
    <div className="info-card">
      <img 
        className="poster" 
        src={`https://image.tmdb.org/t/p/w500${poster_path}`} 
        alt={original_title} 
      />
      <div className="info-details">
        <h1>{original_title}</h1>
        <p><strong>Release Year:</strong> {release_date.split('-')[0]}</p>
        <p><strong>Duration:</strong> {runtime} min</p>
        <p><strong>Rating:</strong> {vote_average}</p>
        <p><strong>Genre:</strong> {genres.map((genre) => genre.name).join(', ')}</p>
        <p><strong>Description:</strong> {overview}</p>
        <p><strong>Production Companies:</strong> {production_companies.map((company) => company.name).join(', ')}</p>
        <h2>Cast</h2>
        <ul className="cast-list">
          {cast.map((member) => (
            <li key={member.id}>
              <strong>{member.name}</strong> as {member.character}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
