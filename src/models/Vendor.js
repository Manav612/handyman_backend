const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  profession: [{ type: String }], // Plumber, Electrician etc.
  serviceRadius: { type: Number, default: 8 }, // in km
  isAvailable: { type: Boolean, default: true },
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
  canTakeMultipleBookings: { type: Boolean, default: false },
  profileImage: { type: String },
  documents: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

vendorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Vendor", vendorSchema);
