const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  base_price: { type: Number, required: true, min: 0 },
  plans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }] // List of available plans
});

module.exports = mongoose.model('Magazine', magazineSchema);
