const Room = require("../models/Room");
const crypto = require("crypto");

// Create room
exports.createRoom = async (req, res) => {
  try {
    const { hostId } = req.body;
    const code = crypto.randomBytes(3).toString("hex");

    const room = await Room.create({ code, hostId });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Join room
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};