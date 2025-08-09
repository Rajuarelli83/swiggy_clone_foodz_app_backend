const axios = require("axios");
const { SWIGGY_MENU_BASE_URL, SWIGGY_HEADERS } = require("./constants");
const fetchSwiggyMenu = async (resId) => {
    const swiggyURL = `${SWIGGY_MENU_BASE_URL}&restaurantId=${resId}`;
  try {
    const response = await axios.get(swiggyURL, {
      headers: SWIGGY_HEADERS
    });

    const data = response.data;
    if (!data || !data.data) {
      throw new Error("Swiggy API response structure unexpected or empty.");
    }

    return data.data;

  } catch (err) {
    console.error(`Error fetching Swiggy menu for resId ${resId}:`, err.message);
    if (err.response) {
      console.error(`Swiggy API responded with status: ${err.response.status}`);
    }
    throw new Error(`Failed to fetch menu from Swiggy: ${err.message}`);
  }
};

module.exports = { fetchSwiggyMenu };