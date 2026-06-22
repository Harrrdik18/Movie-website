import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  logoutUser,
  clearError,
  clearSuccess,
  clearAuth,
} from "../redux/slices/userSlice";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  selectUserSuccess,
} from "../redux/selectors/userSelectors";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email }));
  };

  const handlePasswordUpdate = (e) => {
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
        {displayError && <div className="error-message">{displayError}</div>}
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
              <button type="submit" className="update-button" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
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
              <button type="submit" className="update-button" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
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
