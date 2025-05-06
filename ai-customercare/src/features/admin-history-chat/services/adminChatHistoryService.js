import { db } from "../../../services/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";

/**
 * Mendapatkan semua chat history untuk admin
 * @param {(chats: Array) => void} callback - Fungsi untuk handle data update
 */
export const getAllChatHistory = (callback) => {
  const q = query(collection(db, "chats"), orderBy("timestamp", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate() || new Date();

      chats.push({
        id: doc.id,
        message: data.message,
        sender: data.sender,
        customerId: data.customerId,
        timestamp: timestamp,
        formattedTime: timestamp.toLocaleString(),
      });
    });
    callback(chats);
  });
};

/**
 * Mendapatkan 10 pesan terbaru untuk dashboard
 * @param {(chats: Array) => void} callback - Fungsi untuk handle data update
 */
export const getRecentChats = (callback) => {
  const q = query(
    collection(db, "chats"),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate() || new Date();

      chats.push({
        id: doc.id,
        message: data.message,
        sender: data.sender,
        customerId: data.customerId,
        timestamp: timestamp,
        formattedTime: timestamp.toLocaleString(),
      });
    });
    callback(chats);
  });
};

/**
 * Mendapatkan semua ID customer unik
 * @returns {Promise<Array>} - Array of unique customer IDs
 */
export const getUniqueCustomers = async () => {
  const q = query(collection(db, "chats"));
  const querySnapshot = await getDocs(q);

  const customerIds = new Set();
  querySnapshot.forEach((doc) => {
    customerIds.add(doc.data().customerId);
  });

  return Array.from(customerIds);
};

/**
 * Mendapatkan chat history untuk customer tertentu
 * @param {string} customerId - ID customer
 * @param {(chats: Array) => void} callback - Fungsi untuk handle data update
 */
export const getCustomerChat = (customerId, callback) => {
  const q = query(
    collection(db, "chats"),
    where("customerId", "==", customerId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate() || new Date();

      chats.push({
        id: doc.id,
        message: data.message,
        sender: data.sender,
        customerId: data.customerId,
        timestamp: timestamp,
        formattedTime: timestamp.toLocaleString(),
      });
    });
    callback(chats);
  });
};
