import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  logoutUser,
  clearError,
  clearSuccess,
  clearAuth,
  removeFromFavorites,
  removeFromWatchlist,
} from "../redux/slices/userSlice";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
} from "../redux/selectors/userSelectors";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccess);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .catch(() => {
        localStorage.removeItem("user");
        dispatch(clearAuth());
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email }));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    dispatch(updateUserPassword({ oldPassword, newPassword }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const displayError = error || validationError;

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Change Password" },
    { id: "favorites", label: "Favorites" },
    { id: "watchlist", label: "Watchlist" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 lg:pt-28 pb-16">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="border border-[#2a2a2a] p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-[#c9774d] bg-[#1a1a1a] flex items-center justify-center mb-3">
                  <span className="text-2xl font-serif text-[#f5f5f1]">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#f5f5f1]">{user?.name}</h3>
              </div>

              <div className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left text-sm py-2.5 px-3 transition-colors border-l-2 ${
                      activeTab === tab.id
                        ? "border-[#c9774d] text-[#c9774d] bg-[#c9774d]/5"
                        : "border-transparent text-[#9ca3af] hover:text-[#f5f5f1] hover:border-[#2a2a2a]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-sm py-2.5 px-3 text-[#9ca3af] border border-[#2a2a2a] hover:border-[#c9774d] hover:text-[#c9774d] transition-colors uppercase tracking-[0.1em]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="border border-[#2a2a2a] p-6 lg:p-8">
              {displayError && (
                <div className="mb-6 p-3 border border-[#c9774d]/30 bg-[#c9774d]/5">
                  <span className="text-sm text-[#c9774d]">{displayError}</span>
                </div>
              )}
              {success && (
                <div className="mb-6 p-3 border border-[#2ecc71]/30 bg-[#2ecc71]/5">
                  <span className="text-sm text-[#2ecc71]">{success}</span>
                </div>
              )}

              {activeTab === "profile" && (
                <div>
                  <h2 className="font-serif text-2xl text-[#f5f5f1] mb-6">Edit Profile</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm focus:outline-none focus:border-[#c9774d] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm focus:outline-none focus:border-[#c9774d] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="border border-[#c9774d] text-[#c9774d] px-6 py-2.5 text-sm uppercase tracking-[0.15em] hover:bg-[#c9774d] hover:text-[#0a0a0a] transition-all disabled:opacity-50"
                    >
                      {loading ? "Updating…" : "Update Profile"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div>
                  <h2 className="font-serif text-2xl text-[#f5f5f1] mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">Current Password</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm focus:outline-none focus:border-[#c9774d] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm focus:outline-none focus:border-[#c9774d] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-[#9ca3af] mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm focus:outline-none focus:border-[#c9774d] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="border border-[#c9774d] text-[#c9774d] px-6 py-2.5 text-sm uppercase tracking-[0.15em] hover:bg-[#c9774d] hover:text-[#0a0a0a] transition-all disabled:opacity-50"
                    >
                      {loading ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "favorites" && (
                <div>
                  <h2 className="font-serif text-2xl text-[#f5f5f1] mb-6">Favorites</h2>
                  {user?.favorites?.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {user.favorites.map((movie) => (
                        <div key={movie.movieId} className="group cursor-pointer">
                          <div onClick={() => navigate(`/movie/${movie.movieId}`)} className="border border-[#2a2a2a] overflow-hidden transition-all group-hover:border-[#c9774d]">
                            <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                          </div>
                          <h3 className="text-sm text-[#f5f5f1] mt-2 line-clamp-1 font-serif">{movie.title}</h3>
                          <button
                            onClick={() => dispatch(removeFromFavorites(movie.movieId))}
                            className="text-xs uppercase tracking-[0.1em] text-[#9ca3af] hover:text-[#c9774d] mt-1 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9ca3af] font-serif text-lg italic">No favorites yet.</p>
                  )}
                </div>
              )}

              {activeTab === "watchlist" && (
                <div>
                  <h2 className="font-serif text-2xl text-[#f5f5f1] mb-6">Watchlist</h2>
                  {user?.watchlist?.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {user.watchlist.map((movie) => (
                        <div key={movie.movieId} className="group cursor-pointer">
                          <div onClick={() => navigate(`/movie/${movie.movieId}`)} className="border border-[#2a2a2a] overflow-hidden transition-all group-hover:border-[#c9774d]">
                            <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                          </div>
                          <h3 className="text-sm text-[#f5f5f1] mt-2 line-clamp-1 font-serif">{movie.title}</h3>
                          <button
                            onClick={() => dispatch(removeFromWatchlist(movie.movieId))}
                            className="text-xs uppercase tracking-[0.1em] text-[#9ca3af] hover:text-[#c9774d] mt-1 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9ca3af] font-serif text-lg italic">Nothing in your watchlist yet.</p>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
