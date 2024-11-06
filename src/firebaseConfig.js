// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJlIdJI-4RT0ej9rJsm8UgmPfya9bsoWY",
  authDomain: "complaintsandsuggestions-40f67.firebaseapp.com",
  databaseURL: "https://complaintsandsuggestions-40f67-default-rtdb.firebaseio.com",
  projectId: "complaintsandsuggestions-40f67",
  storageBucket: "complaintsandsuggestions-40f67.firebasestorage.app",
  messagingSenderId: "40408441720",
  appId: "1:40408441720:web:d061cebe1f92a61ffb9e8d",
  measurementId: "G-N3H19BEWJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export const auth = getAuth(app);
export {  db };