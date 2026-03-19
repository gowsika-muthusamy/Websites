const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });}
    const note = new Note({
      user: req.user._id,
      title,
      content,
    });
    await note.save();
    res.status(201).json({
      message: "Note created successfully",
      note,});} 
      catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });}});
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
   res.status(500).json({ message: err.message });
  }});
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });}
    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();
    res.json(note);
  } catch (err) {
   res.status(500).json({ message: err.message });
  }});
router.delete("/:id", auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" }); }
    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;