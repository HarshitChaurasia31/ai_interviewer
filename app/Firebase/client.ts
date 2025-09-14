// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from  "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKlK14iF-og17Uz4HmF7Vvu23HqjF6vHk",
  authDomain: "intprep-c12a5.firebaseapp.com",
  projectId: "intprep-c12a5",
  storageBucket: "intprep-c12a5.firebasestorage.app",
  messagingSenderId: "519792108406",
  appId: "1:519792108406:web:17240a2491e1575bd31057",
  measurementId: "G-PHCECEXSSJ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth =getAuth(app);
export const db =getFirestore(app);