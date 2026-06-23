import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 border border-[#2a2a2a] bg-[#141414] text-[#9ca3af] hover:text-[#f5f5f1] hover:border-[#c9774d] transition-all flex items-center justify-center text-lg"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
