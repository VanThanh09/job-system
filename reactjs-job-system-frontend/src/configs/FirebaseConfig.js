// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAFOP0ar1rpxL-hTDBs9Vl7tu9DgByATHc",
    authDomain: "ptjob-chat.firebaseapp.com",
    projectId: "ptjob-chat",
    storageBucket: "ptjob-chat.firebasestorage.app",
    messagingSenderId: "21488730969",
    appId: "1:21488730969:web:e43a898b71590544aac248",
    measurementId: "G-G1F276XJT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };