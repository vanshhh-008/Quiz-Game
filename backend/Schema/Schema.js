const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  question: String,
  selectedAnswer: String,
  correctAnswer: String,
  Score: Number,
  isCorrect: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const AnswerHistory = mongoose.model("AnswerHistory", AnswerSchema);
module.exports = AnswerHistory;
