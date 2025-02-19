import express from "express";
import admin from "firebase-admin";
import { handleError } from "./middleware/error.middleware.js";
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export const db = admin.firestore();
export const auth = admin.auth();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: "If you can read this message, the backend is live." });
});
app.get("/db", async (req, res) => {
    try {
        const querySnapshot = await db.collection("tests").get();
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push(doc.data());
        });
        res.status(200).json(docs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch data from Firestore" });
    }
});
app.use(handleError);
export default app;
