const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  image: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Series", seriesSchema);
