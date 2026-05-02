const express = require("express");
const Data = require("../models/Data");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const entries = await Data.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch data" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await Data.findById(req.params.id).populate("owner", "name email");

    if (!entry) {
      return res.status(404).json({ success: false, message: "Data entry not found" });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid data entry id" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const entry = await Data.create({
      title,
      description,
      owner: req.user._id
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create data entry" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const entry = await Data.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: "Entry not found or not owned by you" });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to update data entry" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const entry = await Data.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Entry not found or not owned by you" });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to delete data entry" });
  }
});

module.exports = router;
