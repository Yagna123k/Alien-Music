const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  songUrl: { type: String },
  hostId: { type: String, required: true }, // Clerk user ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
