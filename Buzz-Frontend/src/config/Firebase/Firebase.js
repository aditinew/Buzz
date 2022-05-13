import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import firebaseConfig from "./firebase.config";

initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export { auth, storage };
