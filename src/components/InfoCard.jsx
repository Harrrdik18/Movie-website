import React from 'react';

function InfoCard({ movie }) {
    return (
        <div className='info'>
            <h2>{movie.title}</h2>
            <span>{`Rating: ${movie.vote_average}  `}</span>
            <span>{`Release date : ${movie.release_date}`}</span>
            <p>{movie.overview}</p>
        </div>
    );
}

export default InfoCard;
