const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  renewalPeriod: { type: Number, required: true, min: 1 }, // Number of months
  discount: { type: Number, required: true, min: 0, max: 1 }, // Decimal (e.g., 0.1 for 10%)
  tier: { type: Number, required: true, min: 1 }, // Tier level (1 for Silver, 4 for Diamond)
});

module.exports = mongoose.model('Plan', planSchema);
