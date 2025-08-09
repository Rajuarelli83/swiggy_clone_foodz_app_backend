
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  favourites: [{ type: String, ref: 'Restaurant' }], 
  cart: [{ 
    restaurantId: { type: String, required: true },
    itemId: { type: String, required: true },
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model("User", userSchema);