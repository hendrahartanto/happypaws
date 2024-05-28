import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAkCnw3EX833QDgsugQr3En2D_Q5RjotOE",
	authDomain: "happy-paws-ebc62.firebaseapp.com",
	projectId: "happy-paws-ebc62",
	storageBucket: "happy-paws-ebc62.appspot.com",
	messagingSenderId: "232804220805",
	appId: "1:232804220805:web:f927db6b8a0311b85e8eec",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
