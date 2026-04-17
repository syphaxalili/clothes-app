const express = require("express");
const Clothing = require("../models/Clothing");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const clothes = await Clothing.find({ userId: req.userId });
    res.json(clothes);
  } catch (error) {
    console.error("Get clothes error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des vêtements" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      style,
      color,
      isWaterproof,
      temperatureMin,
      temperatureMax,
    } = req.body;

    if (
      !name ||
      !type ||
      !style ||
      !color ||
      temperatureMin === undefined ||
      temperatureMax === undefined
    ) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const clothing = new Clothing({
      userId: req.userId,
      name,
      type,
      style,
      color,
      isWaterproof: isWaterproof || false,
      temperatureMin,
      temperatureMax,
    });

    await clothing.save();
    res.status(201).json(clothing);
  } catch (error) {
    console.error("Create clothing error:", error);
    res.status(500).json({ error: "Erreur lors de la création du vêtement" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      type,
      style,
      color,
      isWaterproof,
      temperatureMin,
      temperatureMax,
    } = req.body;

    if (
      !name ||
      !type ||
      !style ||
      !color ||
      temperatureMin === undefined ||
      temperatureMax === undefined
    ) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const clothing = await Clothing.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name,
        type,
        style,
        color,
        isWaterproof: isWaterproof || false,
        temperatureMin,
        temperatureMax,
      },
      { new: true },
    );

    if (!clothing) {
      return res.status(404).json({ error: "Vêtement non trouvé" });
    }

    res.json(clothing);
  } catch (error) {
    console.error("Update clothing error:", error);
    res.status(500).json({ error: "Impossible de modifier le vêtement" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const clothing = await Clothing.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!clothing) {
      return res.status(404).json({ error: "Vêtement non trouvé" });
    }

    res.json({ message: "Vêtement supprimé avec succès" });
  } catch (error) {
    console.error("Delete clothing error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du vêtement" });
  }
});

module.exports = router;
