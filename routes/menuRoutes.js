const express = require("express");
const router = express.Router();
const axios = require("axios");
const { fetchSwiggyMenu } = require("../utils/fetchSwiggyMenu");

router.get("/", async (req, res) => {
  const { resId } = req.query;
  if (!resId) {
    return res.status(400).json({ message: `resId is required and was undefined.` });
  }

  try {
    const data = await fetchSwiggyMenu(resId);
    res.json({data});
  } catch (err) {
   if (err.message.includes("Failed to fetch menu from Swiggy")) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Failed to fetch menu due to server error." });
  }
});

module.exports = router;
