require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const clothingRoutes = require("./routes/clothing");
const outfitRoutes = require("./routes/outfit");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfit", outfitRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Wardrobe API is running" });
});
