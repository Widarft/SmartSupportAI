import { db } from "../../../services/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
  where,
  getCountFromServer,
  limit,
  Timestamp,
} from "firebase/firestore";

// Helper function to get start and end of day
const getStartAndEndOfDay = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    start: Timestamp.fromDate(startOfDay),
    end: Timestamp.fromDate(endOfDay),
  };
};

// Get the last message timestamp for each customer
export const getCustomerLastMessageTimestamp = async (customerId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const lastMessage = querySnapshot.docs[0].data();
    return lastMessage.timestamp;
  } catch (error) {
    console.error(`Error getting last message for ${customerId}:`, error);
    return null;
  }
};

// Get paginated customers with filtering and sorting
export const getPaginatedCustomers = async (
  page,
  pageSize,
  selectedDate,
  sortOrder = "newest"
) => {
  try {
    const chatsRef = collection(db, "chats");
    let q;

    // Build the query based on filters
    if (selectedDate) {
      const { start, end } = getStartAndEndOfDay(selectedDate);

      q = query(
        chatsRef,
        where("timestamp", ">=", start),
        where("timestamp", "<=", end)
      );
    } else {
      q = query(chatsRef);
    }

    // Get total count
    const snapshot = await getCountFromServer(q);
    const totalChats = snapshot.data().count;

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract unique customer IDs
    const customerMap = new Map();

    // We'll collect customers with their last message timestamp
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (!data.customerId) continue;

      const timestamp = data.timestamp;

      if (!customerMap.has(data.customerId)) {
        customerMap.set(data.customerId, { timestamp });
      } else {
        // Keep the most recent timestamp for sorting
        const currentTimestamp = customerMap.get(data.customerId).timestamp;

        if (timestamp && currentTimestamp) {
          // Compare timestamps and keep the newest
          if (
            (sortOrder === "newest" &&
              timestamp.toMillis() > currentTimestamp.toMillis()) ||
            (sortOrder === "oldest" &&
              timestamp.toMillis() < currentTimestamp.toMillis())
          ) {
            customerMap.set(data.customerId, { timestamp });
          }
        }
      }
    }

    // Convert to array for sorting
    let customersArray = Array.from(customerMap, ([customerId, data]) => ({
      customerId,
      lastTimestamp: data.timestamp,
    }));

    // Sort by timestamp
    customersArray.sort((a, b) => {
      // Handle cases where timestamp might be missing or null
      if (!a.lastTimestamp) return 1;
      if (!b.lastTimestamp) return -1;

      // Sort based on the desired order
      if (sortOrder === "newest") {
        return b.lastTimestamp.toMillis() - a.lastTimestamp.toMillis();
      } else {
        return a.lastTimestamp.toMillis() - b.lastTimestamp.toMillis();
      }
    });

    // Extract just the customer IDs in the right order
    const sortedCustomerIds = customersArray.map((item) => item.customerId);

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCustomers = sortedCustomerIds.slice(startIndex, endIndex);

    return {
      customers: paginatedCustomers,
      total: sortedCustomerIds.length,
    };
  } catch (error) {
    console.error("Error in getPaginatedCustomers:", error);
    throw error;
  }
};

// Get customer chat history
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

// Get last message for display in list
export const getCustomerLastMessage = async (customerId) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const lastMessageDoc = querySnapshot.docs[0];
    const data = lastMessageDoc.data();

    return {
      id: lastMessageDoc.id,
      message: data.message || "",
      sender: data.sender || "unknown",
      timestamp: data.timestamp?.toDate() || new Date(),
    };
  } catch (error) {
    console.error(`Error getting last message for ${customerId}:`, error);
    return null;
  }
};
