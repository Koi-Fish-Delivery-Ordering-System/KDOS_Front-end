// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC4dM9KennpVJURBJPV35GbrFIIg6dRjG0",
  authDomain: "kods-online.firebaseapp.com",
  projectId: "kods-online",
  storageBucket: "kods-online.appspot.com",
  messagingSenderId: "171767902783",
  appId: "1:171767902783:web:dd4511010281fb0d81be8a",
  measurementId: "G-CW1WXMRH1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { storage, googleProvider, analytics, app };
