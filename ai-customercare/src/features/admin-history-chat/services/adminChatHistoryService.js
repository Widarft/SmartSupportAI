import { db, auth } from "../../../services/firebase";
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

// Helper: Awal dan akhir hari
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

// ✅ Mendapatkan timestamp pesan terakhir dari customer
export const getCustomerLastMessageTimestamp = async (customerId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan");

    const chatsRef = collection(db, "users", user.uid, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    return querySnapshot.docs[0].data().timestamp;
  } catch (error) {
    console.error(`Gagal mengambil pesan terakhir dari ${customerId}:`, error);
    return null;
  }
};

// ✅ Mendapatkan daftar customer dengan pagination dan filter tanggal
export const getPaginatedCustomers = async (
  page,
  pageSize,
  selectedDate,
  sortOrder = "newest"
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan");

    const chatsRef = collection(db, "users", user.uid, "chats");
    let q;

    // Filter berdasarkan tanggal
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

    // Hitung total dokumen
    const snapshot = await getCountFromServer(q);
    const totalChats = snapshot.data().count;

    const querySnapshot = await getDocs(q);
    const customerMap = new Map();

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (!data.customerId) continue;

      const timestamp = data.timestamp;
      const existing = customerMap.get(data.customerId);

      if (
        !existing ||
        (timestamp &&
          existing.timestamp &&
          ((sortOrder === "newest" &&
            timestamp.toMillis() > existing.timestamp.toMillis()) ||
            (sortOrder === "oldest" &&
              timestamp.toMillis() < existing.timestamp.toMillis())))
      ) {
        customerMap.set(data.customerId, { timestamp });
      }
    }

    let customersArray = Array.from(customerMap, ([customerId, data]) => ({
      customerId,
      lastTimestamp: data.timestamp,
    }));

    // Sort
    customersArray.sort((a, b) => {
      if (!a.lastTimestamp) return 1;
      if (!b.lastTimestamp) return -1;
      return sortOrder === "newest"
        ? b.lastTimestamp.toMillis() - a.lastTimestamp.toMillis()
        : a.lastTimestamp.toMillis() - b.lastTimestamp.toMillis();
    });

    // Pagination
    const sortedCustomerIds = customersArray.map((item) => item.customerId);
    const startIndex = (page - 1) * pageSize;
    const paginatedCustomers = sortedCustomerIds.slice(
      startIndex,
      startIndex + pageSize
    );

    return {
      customers: paginatedCustomers,
      total: sortedCustomerIds.length,
    };
  } catch (error) {
    console.error("Gagal mendapatkan data customer:", error);
    throw error;
  }
};

// ✅ Mendapatkan riwayat chat customer (realtime listener)
export const getCustomerChat = (customerId, callback) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User tidak ditemukan");
    callback([]);
    return () => {};
  }

  try {
    const chatsRef = collection(db, "users", user.uid, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const chats = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate() || new Date();
          chats.push({
            id: doc.id,
            message: data.message || "",
            sender: data.sender || "unknown",
            customerId: data.customerId || customerId,
            timestamp,
            formattedTime: timestamp.toLocaleString(),
          });
        });
        callback(chats);
      },
      (error) => {
        console.error("Gagal mengambil chat:", error);
        callback([]);
      }
    );
  } catch (err) {
    console.error("Gagal menyambungkan listener:", err);
    callback([]);
    return () => {};
  }
};

// ✅ Mendapatkan pesan terakhir untuk tampilan daftar
export const getCustomerLastMessage = async (customerId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan");

    const chatsRef = collection(db, "users", user.uid, "chats");
    const q = query(
      chatsRef,
      where("customerId", "==", customerId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      message: data.message || "",
      sender: data.sender || "unknown",
      timestamp: data.timestamp?.toDate() || new Date(),
    };
  } catch (error) {
    console.error(`Gagal mengambil pesan terakhir dari ${customerId}:`, error);
    return null;
  }
};
