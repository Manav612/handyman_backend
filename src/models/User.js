const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Optional: for mobile-based login
  email: { type: String },
  address: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default to valid coordinates
    },
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
