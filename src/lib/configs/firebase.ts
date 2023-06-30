import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
require('dotenv').config();

const firebaseConfig = {
    databaseURL: process.env.FIREBASE_DATABASE_URL
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };