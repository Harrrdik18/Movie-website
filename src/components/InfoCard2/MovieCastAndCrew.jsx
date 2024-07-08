import React from 'react';

const MovieCastAndCrew = ({ cast, crew }) => {
  return (
    <div className="movie-cast-and-crew">
      <h2>Cast</h2>
      <ul>
        {cast.map((member) => (
          <li key={member.id}>{member.name} as {member.character}</li>
        ))}
      </ul>
      <h2>Crew</h2>
      <ul>
        {crew.map((member) => (
          <li key={member.id}>{member.name} - {member.job}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieCastAndCrew;
