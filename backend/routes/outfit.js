const express = require("express");
const Clothing = require("../models/Clothing");
const authMiddleware = require("../middleware/auth");
const weatherService = require("../services/weatherService");
const aiService = require("../services/aiService");

const router = express.Router();

router.use(authMiddleware);

router.post("/suggest", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Location coordinates are required" });
    }

    const weather = await weatherService.getWeather(latitude, longitude);
    const { temperature, isRaining } = weather;

    const allClothes = await Clothing.find({ userId: req.userId });

    if (allClothes.length === 0) {
      return res
        .status(400)
        .json({ error: "Aucun vêtement dans la garde-robe" });
    }

    let filteredClothes = allClothes.filter(
      (item) =>
        item.temperatureMin <= temperature &&
        item.temperatureMax >= temperature,
    );

    if (isRaining) {
      const waterproofItems = filteredClothes.filter(
        (item) => item.isWaterproof,
      );
      if (waterproofItems.length > 0) {
        filteredClothes = filteredClothes.map((item) => {
          if (item.type === "outerwear" || item.type === "shoes") {
            return waterproofItems.find((w) => w.type === item.type) || item;
          }
          return item;
        });
      }
    }

    if (filteredClothes.length === 0) {
      return res.status(400).json({
        error: "Aucun vêtement approprié pour la météo actuelle",
        weather: { temperature, isRaining },
      });
    }

    const clothesForAI = filteredClothes.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      type: item.type,
      style: item.style,
      color: item.color,
      isWaterproof: item.isWaterproof,
    }));

    const outfitSuggestion = await aiService.generateOutfit(
      clothesForAI,
      temperature,
      isRaining,
    );

    const outfitDetails = {};
    for (const [key, value] of Object.entries(outfitSuggestion.outfit)) {
      if (value && key !== "accessories") {
        const item = allClothes.find((c) => c._id.toString() === value);
        if (item) outfitDetails[key] = item;
      } else if (key === "accessories" && Array.isArray(value)) {
        outfitDetails[key] = value
          .map((id) => allClothes.find((c) => c._id.toString() === id))
          .filter(Boolean);
      }
    }

    res.json({
      weather: { temperature, isRaining },
      outfit: outfitDetails,
      explanation: outfitSuggestion.explanation,
    });
  } catch (error) {
    console.error("Outfit suggestion error:", error);
    res
      .status(500)
      .json({ error: error.message || "Échec de la génération de la tenue" });
  }
});

module.exports = router;
