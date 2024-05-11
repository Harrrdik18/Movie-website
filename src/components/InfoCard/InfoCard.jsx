import React from 'react';
import styles from "./InfoCard.module.css"

function InfoCard({ movie }) {
    return (
        <div className='info'>
            <h2 className={styles.title}>{movie.title}</h2>
            <span className={styles.rating}>{`Rating: ${movie.vote_average}  |  `}</span> 
    
            <span className={styles.rating}>{`Release date : ${movie.release_date}`}</span>
            <p className={styles.description}>{movie.overview}</p>
        </div>
    );
}

export default InfoCard;
