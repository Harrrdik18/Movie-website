const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  updatePassword, 
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/userController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Authentication routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

// User profile routes
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

// Favorites routes
router.route('/favorites').post(isAuthenticatedUser, addToFavorites);
router.route('/favorites/:id').delete(isAuthenticatedUser, removeFromFavorites);

// Watchlist routes
router.route('/watchlist').post(isAuthenticatedUser, addToWatchlist);
router.route('/watchlist/:id').delete(isAuthenticatedUser, removeFromWatchlist);

module.exports = router;
