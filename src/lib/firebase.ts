import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

// Firebase configuration - replace with your own in a production app
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
// };

// Initialize Firebase
const app = initializeApp(null); // Replace null with your firebaseConfig object
const database = getDatabase(app);
const auth = getAuth(app);

// Sign in anonymously
export const signInAnonymousUser = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("User signed in anonymously:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    throw error;
  }
};

export { app, database, auth };
