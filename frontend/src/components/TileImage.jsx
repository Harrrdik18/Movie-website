import React from "react";

function Card({ poster, title }) {
  return (
    <div>
      <img className="scale-40" src={poster} title={title} />
    </div>
  );
}

export default Card;
