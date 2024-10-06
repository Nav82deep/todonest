// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeaQHnEMGZ3SX6CqUxihR-p4g2JjF0eqw", // Your actual API key
  authDomain: "todonest-fdfd8.firebaseapp.com", // Your actual Auth Domain
  projectId: "todonest-fdfd8", // Your actual Project ID
  storageBucket: "todonest-fdfd8.appspot.com", // Your actual Storage Bucket
  messagingSenderId: "802980219805", // Your actual Messaging Sender ID
  appId: "1:802980219805:web:6aedac3360c2824e5b3d74", // Your actual App ID
  measurementId: "G-K4KV52WN85" // Optional: Your actual Measurement ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
