// proposals.js

const form = document.getElementById("proposalForm");
const list = document.getElementById("proposalList");

// Load saved proposals on page load
document.addEventListener("DOMContentLoaded", loadProposals);

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const details = document.getElementById("details").value;

  if (!title || !details) return;

  const proposal = {
    id: Date.now(), // unique id
    title,
    details,
    votes: 0
  };

  saveProposal(proposal);
  addProposalToList(proposal);

  form.reset();
});

// Add proposal to UI
function addProposalToList(proposal) {
  const li = document.createElement("li");
  li.setAttribute("data-id", proposal.id);

  li.innerHTML = `
    <strong>${proposal.title}</strong>: ${proposal.details}
    <br>
    <span>Votes: <span class="vote-count">${proposal.votes}</span></span>
    <button class="upvote">👍</button>
    <button class="downvote">👎</button>
    <button class="edit">✏️ Edit</button>
    <button class="delete">🗑️ Delete</button>
  `;

  // Event listeners for buttons
  li.querySelector(".upvote").addEventListener("click", () => changeVote(proposal.id, 1));
  li.querySelector(".downvote").addEventListener("click", () => changeVote(proposal.id, -1));
  li.querySelector(".delete").addEventListener("click", () => deleteProposal(proposal.id));
  li.querySelector(".edit").addEventListener("click", () => editProposal(proposal.id));

  list.appendChild(li);
}

// Save proposal to localStorage
function saveProposal(proposal) {
  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];
  proposals.push(proposal);
  localStorage.setItem("proposals", JSON.stringify(proposals));
}

// Load proposals from localStorage
function loadProposals() {
  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];

  // Sort by votes (highest first)
  proposals.sort((a, b) => b.votes - a.votes);

  proposals.forEach(addProposalToList);
}

// Update votes
function changeVote(id, amount) {
  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];
  proposals = proposals.map(p => {
    if (p.id === id) {
      p.votes += amount;
    }
    return p;
  });
  localStorage.setItem("proposals", JSON.stringify(proposals));
  refreshUI();
}

// Delete a proposal
function deleteProposal(id) {
  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];
  proposals = proposals.filter(p => p.id !== id);
  localStorage.setItem("proposals", JSON.stringify(proposals));
  refreshUI();
}

// Edit a proposal
function editProposal(id) {
  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];
  let proposal = proposals.find(p => p.id === id);

  if (proposal) {
    const newTitle = prompt("Edit title:", proposal.title);
    const newDetails = prompt("Edit details:", proposal.details);

    if (newTitle && newDetails) {
      proposal.title = newTitle;
      proposal.details = newDetails;
      localStorage.setItem("proposals", JSON.stringify(proposals));
      refreshUI();
    }
  }
}

// Refresh the list on UI
function refreshUI() {
  list.innerHTML = "";
  loadProposals();
}





let currentUser = null;
const loginForm = document.getElementById("loginForm");
const currentUserDisplay = document.getElementById("currentUser");

// Load saved login
document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = savedUser;
    currentUserDisplay.textContent = `Logged in as: ${currentUser}`;
  }
});

// Handle login
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (username) {
    currentUser = username;
    localStorage.setItem("currentUser", currentUser);
    currentUserDisplay.textContent = `Logged in as: ${currentUser}`;
    loginForm.reset();
  }
});

// Update votes (one per user per proposal)
function changeVote(id, amount) {
  if (!currentUser) {
    alert("You must log in to vote!");
    return;
  }

  let proposals = JSON.parse(localStorage.getItem("proposals")) || [];

  proposals = proposals.map(p => {
    if (p.id === id) {
      // Track which users voted
      if (!p.voters) p.voters = [];

      if (p.voters.includes(currentUser)) {
        alert("You already voted on this proposal!");
      } else {
        p.votes += amount;
        p.voters.push(currentUser);
      }
    }
    return p;
  });

  localStorage.setItem("proposals", JSON.stringify(proposals));
  refreshUI();
}