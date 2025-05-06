import { db } from "../../../services/firebase";
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
    await addDoc(collection(db, "chats"), {
      customerId,
      message,
      sender,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};

export const getCustomerChatHistory = (customerId, callback) => {
  const q = query(
    collection(db, "chats"),
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
  const q = query(collection(db, "chats"));

  return onSnapshot(q, (querySnapshot) => {
    const customerIds = new Set();
    querySnapshot.forEach((doc) => {
      customerIds.add(doc.data().customerId);
    });
    callback(Array.from(customerIds));
  });
};
