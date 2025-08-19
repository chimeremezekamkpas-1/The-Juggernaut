fetch("http://localhost:3000/vote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ category: "candidates", choice: "Alice Johnson", user: "student123" })
});









// Cast a vote
fetch("http://localhost:3000/vote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ category: "candidates", choice: "Alice Johnson" })
}).then(res => res.json())
  .then(data => console.log("Vote success:", data));