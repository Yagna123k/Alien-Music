exports.uploadSong = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({ url: req.file.path }); // Cloudinary gives full URL
};
