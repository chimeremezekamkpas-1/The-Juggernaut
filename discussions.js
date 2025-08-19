let currentUser = localStorage.getItem("currentUser") || null;

const form = document.getElementById("discussionForm");
const list = document.getElementById("discussionList");

// Load existing discussions on page load
document.addEventListener("DOMContentLoaded", loadDiscussions);

// Handle form submission
form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("You must log in first!");
    return;
  }

  const topic = document.getElementById("topic").value;
  const comment = document.getElementById("comment").value;

  const newDiscussion = {
    id: Date.now(),
    topic,
    comment,
    user: currentUser,
    timestamp: new Date().toLocaleString()
  };

  saveDiscussion(newDiscussion);
  addDiscussionToUI(newDiscussion);
  form.reset();
});

// Save to LocalStorage
function saveDiscussion(discussion) {
  let discussions = JSON.parse(localStorage.getItem("discussions")) || [];
  discussions.push(discussion);
  localStorage.setItem("discussions", JSON.stringify(discussions));
}

// Load all discussions
function loadDiscussions() {
  let discussions = JSON.parse(localStorage.getItem("discussions")) || [];
  discussions.forEach(addDiscussionToUI);
}

// Add one discussion to UI
function addDiscussionToUI(disc) {
  const div = document.createElement("div");
  div.classList.add("discussion-box");
  div.innerHTML = `
    <h3>${disc.topic}</h3>
    <p>${disc.comment}</p>
    <small>By ${disc.user} at ${disc.timestamp}</small>
    <hr>
  `;
  list.prepend(div); // newest first
}