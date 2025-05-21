// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, browserPopupRedirectResolver } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDW2h-a8syPwyLbrZ_Lwk3eVidgd4n00mw",
    authDomain: "eightfoldurbanresort.vercel.app",
    projectId: "eightfold-booking-45344",
    storageBucket: "eightfold-booking-45344.appspot.com",
    messagingSenderId: "45728779169",
    appId: "AIzaSyDW2h-a8syPwyLbrZ_Lwk3eVidgd4n00mw",
    measurementId: "G-P6YPYH6JM1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app, {
  popupRedirectResolver: browserPopupRedirectResolver,
});
export const db = getFirestore(app); // 👈 This is what you're missing

export { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';