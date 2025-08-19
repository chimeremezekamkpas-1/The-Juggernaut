const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Connect to MongoDB (replace with your Atlas connection string)
mongoose.connect("mongodb://localhost:27017/campusVotes", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error(err));

// 🔹 Define Schemas
const CandidateSchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});

const PolicySchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});

// 🔹 Models
const Candidate = mongoose.model("Candidate", CandidateSchema);
const Policy = mongoose.model("Policy", PolicySchema);





// Get all options
app.get("/options", async (req, res) => {
  const candidates = await Candidate.find();
  const policies = await Policy.find();
  res.json({ candidates, policies });
});

// Add new candidate/policy (Admin)
app.post("/addOption", async (req, res) => {
  const { category, name } = req.body;
  if (category === "candidates") {
    await Candidate.create({ name });
  } else {
    await Policy.create({ name });
  }
  res.json({ success: true });
});

// Cast a vote
app.post("/vote", async (req, res) => {
  const { category, choice } = req.body;
  if (category === "candidates") {
    await Candidate.findOneAndUpdate({ name: choice }, { $inc: { votes: 1 } });
  } else {
    await Policy.findOneAndUpdate({ name: choice }, { $inc: { votes: 1 } });
  }
  res.json({ success: true });
});

// Get results
app.get("/results", async (req, res) => {
  const candidates = await Candidate.find();
  const policies = await Policy.find();
  res.json({ candidates, policies });
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));