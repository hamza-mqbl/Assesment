const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const Magazine = require("../Models/Magazine.js");
// const Magazine = require('../models/Magazine');


// Get list of magazines with their available plans
router.post('/create-magazine', async (req, res) => {
  try {
    const magazine = new Magazine(req.body);
    await magazine.save();
    res.status(201).json(magazine);
  } catch (err) {
    res.status(400).json({ error: err.message });   
  }
});
router.get('/get-magazines', async (req, res) => {
  try {
    const magazines = await Magazine.find().populate('plans');
    res.json(magazines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/update-magazine/:id', async (req, res) => {
  try {
    const magazine = await Magazine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(magazine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/delete-magazine/:id', async (req, res) => {
  try {
    await Magazine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Magazine deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
