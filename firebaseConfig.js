// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnZDgptUYFIbj_Kspsu5zig_F54wnGEzc",
  authDomain: "simon-b37d3.firebaseapp.com",
  projectId: "simon-b37d3",
  storageBucket: "simon-b37d3.firebasestorage.app",
  messagingSenderId: "760415339559",
  appId: "1:760415339559:web:b22e5f4ecea48b4ad6fa02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };