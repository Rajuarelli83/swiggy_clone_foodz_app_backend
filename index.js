
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path= require("path");


const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  "http://localhost:1234",
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB connection error:", err));


const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes"); 

app.use("/api", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/user", userRoutes); 


app.get("/", (req, res) => {
  res.send(`
    <h1 style="font-family:sans-serif; color:green;">
      ✅ Backend is Running on Port ${PORT}
    </h1>
    <p>Try <code>GET /api/restaurants</code> or <code>POST /api/signup</code></p>
  `);
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 