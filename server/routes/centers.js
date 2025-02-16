const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth"); // Middleware to check auth
const Center = require("../models/Center");

const router = express.Router();

/**
 * @route   POST /api/centers
 * @desc    Add a new recycling center (Admin Only)
 * @access  Private (Admin)
 */
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("location.address", "Address is required").not().isEmpty(),
      check("location.coordinates", "Coordinates must be [longitude, latitude]").isArray({ min: 2, max: 2 }),
      check("acceptedItems", "Accepted items must be provided").isArray({ min: 1 })
    ]
  ],
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied! Only admins can add centers." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newCenter = new Center(req.body);
      const center = await newCenter.save();
      res.json(center);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route   GET /api/centers
 * @desc    Get all recycling centers
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const centers = await Center.find().sort({ date: -1 });
    res.json(centers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/centers/:id
 * @desc    Get a recycling center by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ msg: "Center not found" });
    }
    res.json(center);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Center not found" });
    }
    res.status(500).send("Server Error");
  }
});

/**
 * @route   PUT /api/centers/:id
 * @desc    Update a recycling center (Admin Only)
 * @access  Private (Admin)
 */
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied! Only admins can update centers." });
  }

  try {
    let center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ msg: "Center not found" });
    }

    center = await Center.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(center);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   DELETE /api/centers/:id
 * @desc    Delete a recycling center (Admin Only)
 * @access  Private (Admin)
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied! Only admins can delete centers." });
  }

  try {
    let center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ msg: "Center not found" });
    }

    await Center.findByIdAndRemove(req.params.id);
    res.json({ msg: "Center removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/centers/nearby
 * @desc    Get recycling centers near a location (lat, lng)
 * @access  Public
 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // Default radius: 5000 meters (5km)
    
    if (!lat || !lng) {
      return res.status(400).json({ msg: "Latitude and Longitude are required" });
    }

    const centers = await Center.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius)
        }
      }
    });

    res.json(centers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
