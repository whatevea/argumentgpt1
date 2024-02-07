// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration    
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAS4qYRfoJhFdoIh03Pt-Ww1MqF1WU843A",
    authDomain: "chatapp10111.firebaseapp.com",
    projectId: "chatapp10111",
    storageBucket: "chatapp10111.appspot.com",
    messagingSenderId: "243267660309",
    appId: "1:243267660309:web:3453971906fe1d1c36bc1c",
    measurementId: "G-JGVTZD4WF2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()