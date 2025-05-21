import { onInit } from "firebase-functions/v2/core";
import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import cors from "cors";

let auth;
const corsHandler = cors({ origin: true });

onInit(() => {
  admin.initializeApp();
  auth = admin.auth();
  console.log("Firebase Admin initialized");
});

export const generateCustomToken = onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { clientId } = req.body;
    if (!clientId || typeof clientId !== "string" || clientId.length < 6) {
      return res.status(400).json({ error: "Invalid clientId" });
    }

    try {
      const token = await auth.createCustomToken(clientId);
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Token generation failed:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

export const verifyToken = onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return res.status(200).json({ uid: decodedToken.uid });
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  });
});
