const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  magazine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Magazine', required: true },
  // plan_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true }], // Array of Plan IDs
  price: { type: Number, required: true, min: 0 },
  renewal_date: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
});


module.exports = mongoose.model('Subscription', subscriptionSchema);
