async function signUpWithProfile({ name, email, password, faculty, department }) {
  const errBox = document.getElementById('err');
  const okBox  = document.getElementById('ok');
  errBox.textContent = ''; okBox.textContent = '';

  if (!name || !email || !password) {
    errBox.textContent = 'Please fill name, email and password.';
    return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    await db.collection('users').doc(uid).set({
      name,
      email,
      faculty: faculty || null,
      department: department || null,
      role: 'student',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    okBox.textContent = 'Account created! Redirecting...';
    setTimeout(() => { window.location.href = 'account.html'; }, 800);
  } catch (e) {
    console.error(e);
    errBox.textContent = e.message || 'Sign up failed.';
  }
}

async function logInWithEmail(email, password) {
  const errBox = document.getElementById('err');
  const okBox  = document.getElementById('ok');
  errBox.textContent = ''; okBox.textContent = '';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    okBox.textContent = 'Logged in! Redirecting...';
    setTimeout(() => { window.location.href = 'account.html'; }, 500);
  } catch (e) {
    console.error(e);
    errBox.textContent = e.message || 'Login failed.';
  }
}

function logOut() {
  return auth.signOut().then(() => window.location.href = 'login.html');
}