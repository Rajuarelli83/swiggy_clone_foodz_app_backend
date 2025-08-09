const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");


router.get("/", async (req, res) => {
  try {
    const data = await Restaurant.find({});
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching restaurants:", err.message);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

module.exports = router;