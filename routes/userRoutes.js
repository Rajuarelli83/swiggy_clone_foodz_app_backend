const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant"); 

router.get("/favourites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const favouriteRestaurantIds = user.favourites;
    const favouriteRestaurants = await Restaurant.find({
      id: { $in: favouriteRestaurantIds }
    });

    res.json(favouriteRestaurants);
  } catch (err) {
    console.error("Error fetching favourites:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/favourites", authMiddleware, async (req, res) => {
  const { restaurantId } = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.favourites.includes(restaurantId)) {
      return res.status(400).json({ message: "Restaurant already in favourites" });
    }

    user.favourites.push(restaurantId);
    await user.save();

    res.status(200).json({ message: "Restaurant added to favourites", favourites: user.favourites });
  } catch (err) {
    console.error("Error adding favourite:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/favourites/clear", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favourites = []; 
    await user.save();

    res.status(200).json({ message: "All favourites cleared successfully" });
  } catch (err) {
    console.error("Error clearing all favourites:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/favourites/:id", authMiddleware, async (req, res) => {
  const restaurantIdToRemove = req.params.id;

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.favourites.length;
    user.favourites = user.favourites.filter(
      (id) => id !== restaurantIdToRemove
    );

    if (user.favourites.length === initialLength) {
      return res.status(404).json({ message: "Restaurant not found in favourites" });
    }

    await user.save();

    res.status(200).json({ message: "Restaurant removed from favourites", favourites: user.favourites });
  } catch (err) {
    console.log("Hello from usesrRoutes.js");
    console.error("Error removing favourite:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.cart);
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/cart", authMiddleware, async (req, res) => {
  const { restaurantId, itemId, quantity = 1 } = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let itemFound = false;
    user.cart = user.cart.map(item => {
      if (item.itemId === itemId && item.restaurantId === restaurantId) {
        item.quantity += quantity; 
        itemFound = true;
      }
      return item;
    });

    if (!itemFound) {
      user.cart.push({ restaurantId, itemId, quantity }); 
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    console.error("Error adding item to cart:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/cart/clear", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully", cart: user.cart });
  } catch (err) {
    console.error("Error clearing cart:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;


router.delete("/cart/:itemId", authMiddleware, async (req, res) => {
  const { itemId } = req.params;
  const { restaurantId } = req.query; 

  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let itemIndex = -1;
    let currentQuantity = 0;

    user.cart.forEach((item, index) => {
      if (item.itemId === itemId && item.restaurantId === restaurantId) {
        itemIndex = index;
        currentQuantity = item.quantity;
      }
    });

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item NOT found in cart" });
    }

    if (currentQuantity > 1) {
    
      user.cart[itemIndex].quantity -= 1;
      await user.save();
      res.status(200).json({ message: "Item quantity decremented", cart: user.cart });
    } else {
     
      user.cart.splice(itemIndex, 1); 
      await user.save();
      res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    }

  } catch (err) {
    console.error("Error removing item from cart:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
