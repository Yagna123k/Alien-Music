const express = require("express");
const upload = require("../config/storage");
const { uploadSong } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("song"), uploadSong);

module.exports = router;