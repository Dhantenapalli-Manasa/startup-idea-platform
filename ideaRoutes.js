const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const authMiddleware = require("../middleware/authMiddleware");



router.get("/", authMiddleware, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    console.error("GET IDEAS ERROR:", error);
    res.status(500).json({ message: "Server error while fetching ideas" });
  }
});



router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const idea = await Idea.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(201).json(idea);
  } catch (error) {
    console.error("CREATE IDEA ERROR:", error);
    res.status(500).json({ message: "Server error while creating idea" });
  }
});



router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id,
      user: req.user.id, 
    });

    if (!idea) {
      return res.status(404).json({ message: "Idea not found or unauthorized" });
    }

    await Idea.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Idea deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error while deleting idea" });
  }
});


module.exports = router;
