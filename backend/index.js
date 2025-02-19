const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const AnswerHistory = require("./Schema/Schema.js");
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

  app.post("/api", async (req, res) => {
    try {
      const answers = req.body;
  
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "Invalid data format." });
      }
  
      const savedAnswers = await AnswerHistory.insertMany(answers);
  
      res.status(201).json({ message: "Answer history saved successfully to the database", data: savedAnswers });
    } catch (error) {
      console.error("Error saving answer history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Sample Route
  app.get("/", (req, res) => {
    res.send("Server is running...");
  });
  
  // Start Server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));