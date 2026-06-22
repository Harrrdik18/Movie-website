import React from "react";

interface CardProps {
  poster: string;
  title: string;
}

function Card({ poster, title }: CardProps) {
  return (
    <div>
      <img className="scale-40" src={poster} title={title} />
    </div>
  );
}

export default Card;
