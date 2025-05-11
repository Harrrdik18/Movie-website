const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Register a user => /api/v1/users/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: 'default-avatar.jpg'
  });

  sendToken(user, 201, res);
});

// Login user => /api/v1/users/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are entered
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400));
  }

  // Find user in database
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

// Logout user => /api/v1/users/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
});

// Get currently logged in user details => /api/v1/users/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// Update / Change password => /api/v1/users/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile => /api/v1/users/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  // Update avatar: TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    user
  });
});

// Add movie to favorites => /api/v1/users/favorites
exports.addToFavorites = catchAsyncErrors(async (req, res, next) => {
  const { movieId, title, poster, type } = req.body;
  
  const user = await User.findById(req.user.id);
  
  // Check if movie already exists in favorites
  const isExisting = user.favorites.find(item => item.movieId === movieId && item.type === type);
  
  if (isExisting) {
    return next(new ErrorHandler('Movie already in favorites', 400));
  }
  
  user.favorites.push({ movieId, title, poster, type });
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Added to favorites',
    favorites: user.favorites
  });
});

// Remove movie from favorites => /api/v1/users/favorites/:id
exports.removeFromFavorites = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  user.favorites = user.favorites.filter(item => item.movieId.toString() !== req.params.id);
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Removed from favorites',
    favorites: user.favorites
  });
});

// Add movie to watchlist => /api/v1/users/watchlist
exports.addToWatchlist = catchAsyncErrors(async (req, res, next) => {
  const { movieId, title, poster, type } = req.body;
  
  const user = await User.findById(req.user.id);
  
  // Check if movie already exists in watchlist
  const isExisting = user.watchlist.find(item => item.movieId === movieId && item.type === type);
  
  if (isExisting) {
    return next(new ErrorHandler('Movie already in watchlist', 400));
  }
  
  user.watchlist.push({ movieId, title, poster, type });
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Added to watchlist',
    watchlist: user.watchlist
  });
});

// Remove movie from watchlist => /api/v1/users/watchlist/:id
exports.removeFromWatchlist = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  user.watchlist = user.watchlist.filter(item => item.movieId.toString() !== req.params.id);
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Removed from watchlist',
    watchlist: user.watchlist
  });
});
