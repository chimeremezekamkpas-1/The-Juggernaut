// Replace with your Firebase config from console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Helpful handles everywhere
window.auth = firebase.auth();
window.db   = firebase.firestore();

// Keep users logged in across refresh
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);