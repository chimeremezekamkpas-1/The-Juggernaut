function renderOptions(type, containerId) {
  const box = document.getElementById(containerId);
  db.collection(type).onSnapshot(snap => {
    box.innerHTML = '';
    snap.forEach(doc => {
      const item = doc.data();
      const div = document.createElement('div');
      div.className = 'opt';
      div.innerHTML = `
        ${item.name || item.title} 
        <button onclick="castVote('${type}','${doc.id}')">Vote</button>
      `;
      box.appendChild(div);
    });
  });
}

async function castVote(type, optionId) {
  const user = auth.currentUser;
  if (!user) { alert("Please log in first."); return; }

  const voteRef = db.collection('votes').doc(`${type}_${user.uid}`);
  const data = await voteRef.get();

  if (data.exists) {
    alert("You already voted in this category!");
    return;
  }

  await voteRef.set({
    userId: user.uid,
    category: type,
    choice: optionId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Vote recorded!");
}

auth.onAuthStateChanged(user => {
  renderOptions('candidates','candidates');
  renderOptions('policies','policies');
});
