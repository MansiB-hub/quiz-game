const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Quiz-Game", { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Quiz Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
});

const Question = mongoose.model("Question", questionSchema);

// API to fetch questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().limit(10); // Fetch 10 questions
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
