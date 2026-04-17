const express = require('express');
const Clothing = require('../models/Clothing');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const clothes = await Clothing.find({ userId: req.userId });
    res.json(clothes);
  } catch (error) {
    console.error('Get clothes error:', error);
    res.status(500).json({ error: 'Failed to fetch clothing items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, style, color, isWaterproof, temperatureMin, temperatureMax } = req.body;

    if (!name || !type || !style || !color || temperatureMin === undefined || temperatureMax === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const clothing = new Clothing({
      userId: req.userId,
      name,
      type,
      style,
      color,
      isWaterproof: isWaterproof || false,
      temperatureMin,
      temperatureMax
    });

    await clothing.save();
    res.status(201).json(clothing);
  } catch (error) {
    console.error('Create clothing error:', error);
    res.status(500).json({ error: 'Failed to create clothing item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const clothing = await Clothing.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!clothing) {
      return res.status(404).json({ error: 'Clothing item not found' });
    }

    res.json({ message: 'Clothing item deleted successfully' });
  } catch (error) {
    console.error('Delete clothing error:', error);
    res.status(500).json({ error: 'Failed to delete clothing item' });
  }
});

module.exports = router;
