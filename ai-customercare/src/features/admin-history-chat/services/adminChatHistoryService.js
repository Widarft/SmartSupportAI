import { db } from "../../../services/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  where,
  getCountFromServer,
} from "firebase/firestore";

/**
 * Mendapatkan daftar customer dengan pagination
 * @param {number} page - Halaman saat ini
 * @param {number} pageSize - Jumlah item per halaman
 * @returns {Promise<{customers: Array, total: number}>} - Data customer dan total
 */
export const getPaginatedCustomers = async (page, pageSize) => {
  try {
    const customersRef = collection(db, "chats");
    const q = query(customersRef);

    // Get total count
    const snapshot = await getCountFromServer(q);
    const total = snapshot.data().count;

    // Get unique customer IDs
    const querySnapshot = await getDocs(q);
    const customerIds = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Pastikan customerId ada dan tidak undefined/null
      if (data.customerId) {
        customerIds.add(data.customerId);
      }
    });

    const uniqueCustomers = Array.from(customerIds);

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCustomers = uniqueCustomers.slice(startIndex, endIndex);

    return {
      customers: paginatedCustomers,
      total: uniqueCustomers.length,
    };
  } catch (error) {
    console.error("Error in getPaginatedCustomers:", error);
    throw error;
  }
};

/**
 * Mendapatkan chat history untuk customer tertentu
 * @param {string} customerId - ID customer
 * @param {(chats: Array) => void} callback - Fungsi untuk handle data update
 * @returns {Function} - Unsubscribe function
 */
export const getCustomerChat = (customerId, callback) => {
  if (!customerId) {
    console.error("Customer ID is required");
    callback([]);
    return () => {};
  }

  console.log("Setting up listener for customer:", customerId);

  try {
    // Verifikasi struktur database terlebih dahulu
    console.log("Collection path:", "chats");

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "asc")
    );

    console.log("Query created successfully");

    return onSnapshot(
      q,
      (querySnapshot) => {
        console.log("Snapshot received, document count:", querySnapshot.size);
        const chats = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Document data:", doc.id, data);

          // Handle timestamp with fallback
          let timestamp;
          try {
            timestamp = data.timestamp?.toDate() || new Date();
          } catch (err) {
            console.warn(
              "Error converting timestamp, using current date:",
              err
            );
            timestamp = new Date();
          }

          chats.push({
            id: doc.id,
            message: data.message || "",
            sender: data.sender || "unknown",
            customerId: data.customerId || customerId, // Fallback to parameter
            timestamp: timestamp,
            formattedTime: timestamp.toLocaleString(),
          });
        });
        callback(chats);
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
        callback([]);
      }
    );
  } catch (err) {
    console.error("Error setting up chat listener:", err);
    callback([]);
    return () => {};
  }
};
