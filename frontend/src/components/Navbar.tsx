import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/selectors/userSelectors";

interface NavbarProps {
  onSearchOpen: () => void;
}

const Navbar = ({ onSearchOpen }: NavbarProps) => {
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/tv-series", label: "TV Series" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md shadow-[0_1px_0_#2a2a2a]"
          : "bg-[#0a0a0a]/30 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-serif text-2xl lg:text-3xl text-[#f5f5f1] tracking-tight hover:text-[#c9774d] transition-colors"
          >
            cineglance
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                    isActive
                      ? "text-[#c9774d]"
                      : "text-[#9ca3af] hover:text-[#f5f5f1]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onSearchOpen}
            className="text-[#9ca3af] hover:text-[#f5f5f1] transition-colors text-sm uppercase tracking-[0.15em]"
          >
            Search
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <div className="w-px h-4 bg-[#2a2a2a]" />
            {isLoggedIn ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                    isActive
                      ? "text-[#c9774d]"
                      : "text-[#9ca3af] hover:text-[#f5f5f1]"
                  }`
                }
              >
                Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-xs uppercase tracking-[0.15em] text-[#9ca3af] hover:text-[#f5f5f1] transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-xs uppercase tracking-[0.15em] border border-[#2a2a2a] px-4 py-1.5 text-[#f5f5f1] hover:border-[#c9774d] hover:text-[#c9774d] transition-colors"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-[#f5f5f1] transition-transform ${isMenuOpen ? "rotate-45 translate-y-[2.5px]" : ""}`} />
            <span className={`block w-5 h-px bg-[#f5f5f1] transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-[#f5f5f1] transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-[2.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-[#141414] border-t border-[#2a2a2a] animate-fade-in">
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "text-[#c9774d]"
                      : "text-[#9ca3af] hover:text-[#f5f5f1]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="w-full h-px bg-[#2a2a2a] my-2" />
            {isLoggedIn ? (
              <NavLink
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm uppercase tracking-[0.15em] text-[#9ca3af] hover:text-[#f5f5f1] transition-colors"
              >
                Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] text-[#9ca3af] hover:text-[#f5f5f1] transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] text-[#9ca3af] hover:text-[#f5f5f1] transition-colors"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
