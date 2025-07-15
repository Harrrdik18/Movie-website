import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateProfile,
  updatePassword,
  logout,
} from "../services/authService";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { user } = await getUserProfile();
        setUser(user);
        setName(user.name);
        setEmail(user.email);
      } catch (error) {
        setError("Failed to load profile. Please login again.");
        localStorage.removeItem("user");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { user: updatedUser } = await updateProfile({ name, email });
      setUser(updatedUser);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError(error.error || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword({ oldPassword, newPassword });
      setSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.error || "Failed to update password");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <img src="/default-avatar.jpg" alt="User Avatar" />
          <h3>{user?.name}</h3>
        </div>
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
          <button
            className={`tab-button ${
              activeTab === "favorites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            My Favorites
          </button>
          <button
            className={`tab-button ${
              activeTab === "watchlist" ? "active" : ""
            }`}
            onClick={() => setActiveTab("watchlist")}
          >
            My Watchlist
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {activeTab === "profile" && (
          <div className="profile-form-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="update-button">
                Update Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="password-form-container">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="update-button">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="favorites-container">
            <h2>My Favorites</h2>
            {user?.favorites?.length > 0 ? (
              <div className="favorites-grid">
                {user.favorites.map((movie) => (
                  <div key={movie.movieId} className="favorite-card">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="favorite-info">
                      <h3>{movie.title}</h3>
                      <button
                        onClick={() => navigate(`/movie/${movie.movieId}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                You haven't added any favorites yet.
              </p>
            )}
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="watchlist-container">
            <h2>My Watchlist</h2>
            {user?.watchlist?.length > 0 ? (
              <div className="watchlist-grid">
                {user.watchlist.map((movie) => (
                  <div key={movie.movieId} className="watchlist-card">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="watchlist-info">
                      <h3>{movie.title}</h3>
                      <button
                        onClick={() => navigate(`/movie/${movie.movieId}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                You haven't added any movies to your watchlist yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
