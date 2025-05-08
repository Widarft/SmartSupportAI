import { db } from "../../../services/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
  where,
  getCountFromServer,
} from "firebase/firestore";

export const getPaginatedCustomers = async (page, pageSize) => {
  try {
    const customersRef = collection(db, "chats");
    const q = query(customersRef);

    const snapshot = await getCountFromServer(q);
    const total = snapshot.data().count;

    const querySnapshot = await getDocs(q);
    const customerIds = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.customerId) {
        customerIds.add(data.customerId);
      }
    });

    const uniqueCustomers = Array.from(customerIds);

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

export const getCustomerChat = (customerId, callback) => {
  if (!customerId) {
    console.error("Customer ID is required");
    callback([]);
    return () => {};
  }

  console.log("Setting up listener for customer:", customerId);

  try {
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
            customerId: data.customerId || customerId,
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
