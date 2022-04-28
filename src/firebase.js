// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYMl9uADI6Zk8a4NLvGfe4zG29Sd7FOBE",
    authDomain: "stempbl2022.firebaseapp.com",
    projectId: "stempbl2022",
    storageBucket: "stempbl2022.appspot.com",
    messagingSenderId: "251937321295",
    appId: "1:251937321295:web:a0b0f464089fbab893d53a",
    measurementId: "G-LPSW8QH5TM"
};
// Initialize Firebase

export default { app, auth: getAuth(app), firestore: getFirestore(app) }