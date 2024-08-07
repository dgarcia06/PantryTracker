// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdpmc0w9BSzuuShu3SFRPxQcbL5hZeziw",
  authDomain: "pantry-tracker-3119b.firebaseapp.com",
  projectId: "pantry-tracker-3119b",
  storageBucket: "pantry-tracker-3119b.appspot.com",
  messagingSenderId: "562021578587",
  appId: "1:562021578587:web:0d20a2eb2a7832818f0c7e",
  measurementId: "G-5XK7S1SPB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { firestore, analytics };
