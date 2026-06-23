import { buildHeroGradientCSS } from "../utils/gradientBackgrounds";

interface GradientBackgroundProps {
  genre?: string;
  className?: string;
}

const GradientBackground = ({ genre = "", className = "" }: GradientBackgroundProps) => {
  const gradientCSS = buildHeroGradientCSS(genre);

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ backgroundImage: gradientCSS }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )
          `,
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
};

export default GradientBackground;
