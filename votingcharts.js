function renderChart(canvasId, labels, data) {
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: { labels, datasets:[{ label:"Votes", data }] },
    options: { responsive:true }
  });
}

async function loadResults(type, canvasId) {
  const options = await db.collection(type).get();
  const votes = await db.collection('votes').where('category','==',type).get();

  const counts = {};
  options.forEach(doc => { counts[doc.id] = 0; });

  votes.forEach(doc => {
    const choice = doc.data().choice;
    if (counts[choice] !== undefined) counts[choice]++;
  });

  const labels = [];
  const data = [];
  options.forEach(doc => {
    labels.push(doc.data().name || doc.data().title);
    data.push(counts[doc.id]);
  });

  renderChart(canvasId, labels, data);
}

loadResults('candidates','candidatesChart');
loadResults('policies','policiesChart');
