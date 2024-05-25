import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwXCIvg5CmXXUjVsbopH5DvEDUNJBC6e0",
  authDomain: "travelohi-ef7d8.firebaseapp.com",
  projectId: "travelohi-ef7d8",
  storageBucket: "travelohi-ef7d8.appspot.com",
  messagingSenderId: "607760096310",
  appId: "1:607760096310:web:dac9666633a303db368c97",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
