function requireAdmin() {
  auth.onAuthStateChanged(async user => {
    if (!user) { alert("Login required"); return; }
    const u = await db.collection('users').doc(user.uid).get();
    if (!u.exists || u.data().role !== 'admin') {
      alert("Not authorized");
      window.location.href = "/";
    }
  });
}

async function addCandidate() {
  const name = document.getElementById('candidateName').value.trim();
  if (!name) return;
  await db.collection('candidates').add({ name });
  document.getElementById('candidateName').value = '';
}

async function addPolicy() {
  const title = document.getElementById('policyTitle').value.trim();
  if (!title) return;
  await db.collection('policies').add({ title });
  document.getElementById('policyTitle').value = '';
}

requireAdmin();