// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdrTtc0YsELPLyyXSRMolT_G0vH89axLo",
  authDomain: "bio-page-cntt.firebaseapp.com",
  projectId: "bio-page-cntt",
  storageBucket: "bio-page-cntt.firebasestorage.app",
  messagingSenderId: "721792779651",
  appId: "1:721792779651:web:5ce946815e38769005a2b6",
  measurementId: "G-Q3T1XVXW1K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Export the initialized app
export default app;
