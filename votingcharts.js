function loadResults(type) {
  fetch("http://localhost:3000/results")
    .then(res => res.json())
    .then(data => {
      // Get either candidates or policies based on button clicked
      const categoryData = data[type]; 
      const labels = Object.keys(categoryData);
      const votes = Object.values(categoryData);

      // Destroy old chart if it exists
      if (window.resultsChart) {
        window.resultsChart.destroy();
      }

      // Draw chart
      const ctx = document.getElementById("resultsChart").getContext("2d");
      window.resultsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: `Votes for ${type}`,
            data: votes,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(err => console.error("Error loading results:", err));
}