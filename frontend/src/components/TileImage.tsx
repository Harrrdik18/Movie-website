interface CardProps {
  poster: string;
  title: string;
}

function Card({ poster, title }: CardProps) {
  return (
    <div className="border border-[#2a2a2a] overflow-hidden hover:border-[#c9774d] transition-colors">
      <img
        src={poster}
        title={title}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export default Card;
