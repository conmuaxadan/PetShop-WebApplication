import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyACpdFgRUUbqXOU-VO1LTgZOsPk9nuXgRQ",
    authDomain: "agricultural-e-commerce.firebaseapp.com",
    projectId: "agricultural-e-commerce",
    storageBucket: "agricultural-e-commerce.firebasestorage.app",
    messagingSenderId: "48659302259",
    appId: "1:48659302259:web:fdb28536883f66e47a2706",
    measurementId: "G-YQPL5RQPJ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();



export { auth, googleProvider, facebookProvider };
