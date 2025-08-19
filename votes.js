let currentUser = localStorage.getItem("currentUser") || null;

// Example data
const candidates = ["Alice Johnson", "Bob Smith"];
const policies = ["Free WiFi on Campus", "Longer Library Hours"];

const categorySelect = document.getElementById("category");
const optionsContainer = document.getElementById("optionsContainer");
const resultsDiv = document.getElementById("results");
const form = document.getElementById("voteForm");

// Load first category by default
renderOptions("candidates");
renderResults("candidates");

// Handle category change
categorySelect.addEventListener("change", () => {
  renderOptions(categorySelect.value);
  renderResults(categorySelect.value);
});

// Render voting options
function renderOptions(category) {
  const items = category === "candidates" ? candidates : policies;
  optionsContainer.innerHTML = items
    .map(
      (item, i) => `
      <label>
        <input type="radio" name="voteOption" value="${item}" required>
        ${item}
      </label><br>`
    )
    .join("");
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("You must log in to vote!");
    return;
  }

  const category = categorySelect.value;
  const choice = document.querySelector("input[name='voteOption']:checked").value;

  // Save vote
  saveVote(category, choice);

  renderResults(category);
  alert("Vote submitted successfully!");
});

// Save votes to LocalStorage
function saveVote(category, choice) {
  let votes = JSON.parse(localStorage.getItem("votes")) || {};
  if (!votes[category]) votes[category] = {};

  // Prevent multiple votes from same user
  let userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};
  if (userVotes[currentUser] && userVotes[currentUser][category]) {
    alert("You already voted in this category!");
    return;
  }

  // Count the vote
  votes[category][choice] = (votes[category][choice] || 0) + 1;

  // Track that user has voted
  if (!userVotes[currentUser]) userVotes[currentUser] = {};
  userVotes[currentUser][category] = choice;

  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("userVotes", JSON.stringify(userVotes));
}

// Render results
function renderResults(category) {
  let votes = JSON.parse(localStorage.getItem("votes")) || {};
  let results = votes[category] || {};

  let html = Object.entries(results)
    .map(([option, count]) => `<p><strong>${option}:</strong> ${count} votes</p>`)
    .join("");

  resultsDiv.innerHTML = html || "<p>No votes yet.</p>";
}