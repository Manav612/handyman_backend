// controllers/reviewController.js
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Vendor = require("../models/Vendor");

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vendorId = req.params.vendorId;
    const userId = req.user.id; // from auth middleware

    console.log("userId:", userId);
    console.log("vendorId:", vendorId);

    // Check if booking with this vendor exists & is completed
    const booking = await Booking.findOne({
      user: userId,
      vendor: vendorId,
      status: "completed",
    });

    if (!booking) {
      return res
        .status(400)
        .json({ message: "You can only review after completing a booking." });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      vendor: vendorId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this vendor." });
    }

    const review = await Review.create({
      vendor: vendorId,
      user: userId,
      rating,
      comment,
    });

    // Recalculate rating
    const allReviews = await Review.find({ vendor: vendorId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Vendor.findByIdAndUpdate(vendorId, {
      rating: avgRating.toFixed(1),
      reviewsCount: allReviews.length,
    });

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding review", error: err.message });
  }
};

exports.getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const reviews = await Review.find({ vendor: vendorId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
};
