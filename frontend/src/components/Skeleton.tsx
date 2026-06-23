interface SkeletonProps {
  type?: "card" | "text" | "hero";
  count?: number;
}

const Skeleton = ({ type = "card", count = 1 }: SkeletonProps) => {
  if (type === "hero") {
    return (
      <div className="h-[90vh] min-h-[600px] bg-[#0a0a0a] animate-pulse">
        <div className="h-full flex items-center px-12 max-w-screen-2xl mx-auto">
          <div className="space-y-6 w-full max-w-2xl">
            <div className="h-4 bg-[#1a1a1a] w-24" />
            <div className="h-16 bg-[#1a1a1a] w-3/4" />
            <div className="h-4 bg-[#1a1a1a] w-48" />
            <div className="space-y-2">
              <div className="h-4 bg-[#1a1a1a] w-full" />
              <div className="h-4 bg-[#1a1a1a] w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-[#1a1a1a] w-full" />
        <div className="h-4 bg-[#1a1a1a] w-5/6" />
        <div className="h-4 bg-[#1a1a1a] w-2/3" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-[#1a1a1a] border border-[#2a2a2a]" />
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-[#1a1a1a] w-3/4" />
            <div className="h-3 bg-[#1a1a1a] w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
