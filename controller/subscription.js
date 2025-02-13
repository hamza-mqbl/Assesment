const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const Magazine = require("../Models/Magazine.js");
const Subscription = require("../Models/Subscription.js");

// Subscription CRUD
router.post('/create-subscription', async (req, res) => {
  try {
    const { user_id, magazine_id } = req.body;
    const magazine = await Magazine.findById(magazine_id).populate('plans');

    if (!magazine) return res.status(404).json({ error: 'Magazine not found' });
    if (!magazine.plans.length) return res.status(400).json({ error: 'No plans available for this magazine' });

    // Calculate total price after discounts
    const discountPrice = magazine.plans.reduce((total, plan) => total + magazine.base_price * (1 - plan.discount), 0);

    // Set renewal date (based on the longest renewal period among plans)
    const maxRenewalPeriod = Math.max(...magazine.plans.map(plan => plan.renewalPeriod));
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + maxRenewalPeriod);

    const subscription = new Subscription({
      user_id,
      magazine_id,
      price: discountPrice,
      renewal_date: renewalDate,
      is_active: true,
    });

    await subscription.save();
    res.status(201).json({ ...subscription.toObject(), magazine });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/get-subscriptions', async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate({
        path: 'magazine_id',
        populate: { path: 'plans' } // Populate plans within the magazine
      });

    const formattedSubscriptions = subscriptions.map(sub => {
      const { _id, user_id, price, renewal_date, is_active, __v } = sub.toObject();
      return { _id, user_id, magazine: sub.magazine_id.toObject(), price, renewal_date, is_active, __v };
    });

    res.json(formattedSubscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update-subscription/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('magazine_id');
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    res.json({ ...subscription.toObject(), magazine: subscription.magazine_id.toObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/get-subscription/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate({ path: 'magazine_id', populate: { path: 'plans' } });
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Flatten magazine object
    const { _id, user_id, price, renewal_date, is_active, __v } = subscription.toObject();
    const magazine = subscription.magazine_id.toObject();
    
    res.json({ _id, user_id, magazine, price, renewal_date, is_active, __v });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete-subscription/:id', async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
