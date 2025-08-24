auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // If you want to allow guests, remove this redirect
    window.location.href = 'login.html';
    return;
  }

  // Profile info
  document.getElementById('email').textContent = user.email;

  const userDoc = await db.collection('users').doc(user.uid).get();
  if (userDoc.exists) {
    const u = userDoc.data();
    document.getElementById('name').textContent = u.name || '—';
    document.getElementById('faculty').textContent = u.faculty || '—';
    document.getElementById('department').textContent = u.department || '—';
    if (u.role === 'admin') {
      document.getElementById('roleLine').textContent = 'Role: Admin';
      document.getElementById('adminCard').style.display = '';
      loadAdminLogs(user.uid);
    }
  }

  // History lists
  loadVotes(user.uid);
  loadProposals(user.uid);
  loadDiscussions(user.uid);
});

async function loadVotes(uid) {
  const ul = document.getElementById('votesList');
  ul.innerHTML = '';
  const snap = await db.collection('votes').where('userId', '==', uid).orderBy('timestamp', 'desc').limit(50).get();
  if (snap.empty) { ul.innerHTML = '<li class="muted">No votes yet.</li>'; return; }
  snap.forEach(doc => {
    const v = doc.data();
    const li = document.createElement('li');
    li.textContent = `[${(v.category||'').toUpperCase()}] ${v.choice} — ${v.timestamp?.toDate?.().toLocaleString() || ''}`;
    ul.appendChild(li);
  });
}

async function loadProposals(uid) {
  const ul = document.getElementById('propsList');
  ul.innerHTML = '';
  const snap = await db.collection('proposals').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(50).get();
  if (snap.empty) { ul.innerHTML = '<li class="muted">No proposals yet.</li>'; return; }
  snap.forEach(doc => {
    const p = doc.data();
    const li = document.createElement('li');
    li.textContent = `${p.title || '(Untitled)'} — ${p.createdAt?.toDate?.().toLocaleDateString() || ''}`;
    ul.appendChild(li);
  });
}

async function loadDiscussions(uid) {
  const ul = document.getElementById('discsList');
  ul.innerHTML = '';
  const snap = await db.collection('discussions').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(50).get();
  if (snap.empty) { ul.innerHTML = '<li class="muted">No comments yet.</li>'; return; }
  snap.forEach(doc => {
    const d = doc.data();
    const li = document.createElement('li');
    li.textContent = `Commented on ${d.proposalTitle || 'a proposal'} — ${d.createdAt?.toDate?.().toLocaleString() || ''}`;
    ul.appendChild(li);
  });
}

async function loadAdminLogs(uid) {
  const ul = document.getElementById('adminList');
  ul.innerHTML = '';
  const snap = await db.collection('adminLogs').where('userId', '==', uid).orderBy('timestamp', 'desc').limit(50).get();
  if (snap.empty) { ul.innerHTML = '<li class="muted">No admin actions.</li>'; return; }
  snap.forEach(doc => {
    const a = doc.data();
    const li = document.createElement('li');
    li.textContent = `${a.action || 'action'} — ${a.timestamp?.toDate?.().toLocaleString() || ''}`;
    ul.appendChild(li);
  });
}