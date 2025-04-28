// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuWusLvYLZ0-aCvhzI467lvo-k4n80gHg",
    authDomain: "wt-lab4.firebaseapp.com",
    projectId: "wt-lab4",
    storageBucket: "wt-lab4.firebasestorage.app",
    messagingSenderId: "787597371011",
    appId: "1:787597371011:web:98fcbd6516b3eea64cddb6",
    measurementId: "G-73VK46QL7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();