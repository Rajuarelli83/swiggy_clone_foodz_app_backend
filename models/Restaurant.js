const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  id: String,
  name: String,
  cloudinaryImageId: String,
  locality: String,
  areaName: String,
  costForTwo: String,
  cuisines: [String],
  avgRating: Number,
  veg: Boolean,
  avgRatingString: String,
  totalRatingsString: String,
  deliveryTime: Number,
  lastMileTravel: Number,
  slaString: String,
  isOpen: Boolean,
});


module.exports = mongoose.model("Restaurant", restaurantSchema, "Restaurants");