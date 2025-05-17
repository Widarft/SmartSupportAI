import { db, auth } from "../../../services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const saveChat = async (customerId, message, sender) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    await addDoc(collection(db, "users", user.uid, "chats"), {
      customerId,
      message,
      sender,
      timestamp: serverTimestamp(),
    });

    return { success: true, message: "Chat berhasil disimpan!" };
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};

export const getCustomerChatHistory = (customerId, callback) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User tidak ditemukan. Harap login.");
    return () => {};
  }

  const q = query(
    collection(db, "users", user.uid, "chats"),
    where("customerId", "==", customerId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate() || new Date();

      messages.push({
        id: doc.id,
        message: data.message,
        sender: data.sender,
        timestamp: timestamp,
      });
    });
    callback(messages);
  });
};

export const getAllCustomers = (callback) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User tidak ditemukan. Harap login.");
    return () => {};
  }

  const chatsRef = collection(db, "users", user.uid, "chats");

  return onSnapshot(chatsRef, (querySnapshot) => {
    const customerIds = new Set();
    querySnapshot.forEach((doc) => {
      customerIds.add(doc.data().customerId);
    });
    callback(Array.from(customerIds));
  });
};
