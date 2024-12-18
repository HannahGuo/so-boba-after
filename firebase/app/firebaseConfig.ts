import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtjjbGJgEME2fhOfRRL1ehPtSYHbNV180",
  authDomain: "so-boba-after.firebaseapp.com",
  projectId: "so-boba-after",
  storageBucket: "so-boba-after.firebasestorage.app",
  messagingSenderId: "434274563582",
  appId: "1:434274563582:web:6bd8fa3852296359fafcaf",
  measurementId: "G-CGPNK9R9SS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);