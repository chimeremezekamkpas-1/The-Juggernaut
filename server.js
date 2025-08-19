const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let votes = {
  candidates: {},
  policies: {}
};

let candidates = ["Alice Johnson", "Bob Smith"];
let policies = ["Free WiFi", "Longer Library Hours"];

// Endpoint: Get all candidates/policies
app.get("/options", (req, res) => {
  res.json({ candidates, policies });
});

// Endpoint: Cast a vote
app.post("/vote", (req, res) => {
  const { category, choice, user } = req.body;
  if (!votes[category][choice]) votes[category][choice] = 0;
  votes[category][choice]++;
  res.json({ success: true, votes });
});

// Endpoint: Results
app.get("/results", (req, res) => {
  res.json(votes);
});

// Endpoint: Admin adds new option
app.post("/addOption", (req, res) => {
  const { category, name } = req.body;
  if (category === "candidates") candidates.push(name);
  else policies.push(name);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));








let votes = {
  candidates: { "Alice Johnson": 12, "Bob Smith": 9 },
  policies: { "Free WiFi": 5, "New Library": 7 }
};

app.get("/results", (req, res) => {
  res.json(votes);
});