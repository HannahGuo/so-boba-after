import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

export const provider = new GoogleAuthProvider()

const firebaseConfig = {
	apiKey: "AIzaSyCtjjbGJgEME2fhOfRRL1ehPtSYHbNV180",
	authDomain: "so-boba-after.firebaseapp.com",
	projectId: "so-boba-after",
	storageBucket: "so-boba-after.firebasestorage.app",
	messagingSenderId: "434274563582",
	appId: "1:434274563582:web:6bd8fa3852296359fafcaf",
	measurementId: "G-CGPNK9R9SS",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const analytics = getAnalytics(app)
