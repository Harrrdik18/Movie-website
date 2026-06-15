const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    avatar: {
      type: String,
      default: "default-avatar.jpg",
    },

    favorites: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        poster: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["movie", "tv"],
          default: "movie",
        },
      },
    ],

    watchlist: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        poster: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["movie", "tv"],
          default: "movie",
        },
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );
};

module.exports = mongoose.model("User", userSchema);
