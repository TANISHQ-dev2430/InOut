// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ1NVTRvJ9Frn9N8DjUDqTtwBytni6Tlw",
  authDomain: "inout-505af.firebaseapp.com",
  projectId: "inout-505af",
  storageBucket: "inout-505af.firebasestorage.app",
  messagingSenderId: "934977376785",
  appId: "1:934977376785:web:d96b3b80665913de61d7b0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

