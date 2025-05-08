import { db, auth } from "../../../services/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Hitung jumlah FAQ
export const getFAQsCount = async () => {
  const user = auth.currentUser;
  if (!user) return 0;
  const snapshot = await getDocs(collection(db, "users", user.uid, "faqs"));
  return snapshot.size;
};

// Hitung jumlah kategori
export const getCategoriesCount = async () => {
  const user = auth.currentUser;
  if (!user) return 0;
  const snapshot = await getDocs(
    collection(db, "users", user.uid, "categories")
  );
  return snapshot.size;
};

// Hitung jumlah pelanggan yang pernah mengirim pesan
export const getUniqueCustomerCount = async () => {
  const snapshot = await getDocs(collection(db, "chats"));
  const uniqueCustomerIds = new Set();
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.customerId) uniqueCustomerIds.add(data.customerId);
  });
  return uniqueCustomerIds.size;
};

// Ambil 10 pesan terbaru
export const getRecentMessages = async () => {
  const q = query(collection(db, "chats"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  const uniqueMessages = [];
  const seenCustomers = new Set();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const customerId = data.customerId;

    if (customerId && !seenCustomers.has(customerId)) {
      seenCustomers.add(customerId);
      uniqueMessages.push({ id: doc.id, ...data });
    }

    if (uniqueMessages.length >= 5) break;
  }

  return uniqueMessages;
};
