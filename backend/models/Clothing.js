const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['top', 'bottom', 'shoes', 'outerwear', 'accessory']
  },
  style: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  isWaterproof: {
    type: Boolean,
    required: true,
    default: false
  },
  temperatureMin: {
    type: Number,
    required: true
  },
  temperatureMax: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clothing', clothingSchema);
