const Plan = require("../Models/Plan");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const seedPlans = require("./seedPlans.js"); // ✅ Import properly

// ✅ Create a New Plan
router.post(
  "/creat-plan",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { title, description, renewalPeriod, discount, tier } = req.body;

      // Validate required fields
      if (!title || !description || !renewalPeriod || !tier) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const plan = new Plan({
        title,
        description,
        renewalPeriod,
        discount,
        tier,
      });
      await plan.save();

      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Error creating plan" });
    }
  })
);

// ✅ Get All Plans
router.get(
  "/get-plans",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const plans = await Plan.find();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving plans" });
    }
  })
);

// ✅ Get a Single Plan by ID
router.get(
  "/get-plan/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const plan = await Plan.findById(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving plan" });
    }
  })
);

// ✅ Update a Plan
router.put(
  "/update-plan/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { title, description, renewalPeriod, discount, tier } = req.body;
      const updatedPlan = await Plan.findByIdAndUpdate(
        req.params.id,
        { title, description, renewalPeriod, discount, tier },
        { new: true, runValidators: true }
      );

      if (!updatedPlan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      res.json(updatedPlan);
    } catch (error) {
      res.status(500).json({ error: "Error updating plan" });
    }
  })
);

// ✅ Delete a Plan
router.delete(
  "/delete-plan/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
      if (!deletedPlan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting plan" });
    }
  })
);

module.exports = router;
