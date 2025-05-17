import { db, auth } from "../../../services/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const getFAQsCount = async () => {
  const user = auth.currentUser;
  if (!user) return 0;
  const snapshot = await getDocs(collection(db, "users", user.uid, "faqs"));
  return snapshot.size;
};

export const getCategoriesCount = async () => {
  const user = auth.currentUser;
  if (!user) return 0;
  const snapshot = await getDocs(
    collection(db, "users", user.uid, "categories")
  );
  return snapshot.size;
};

export const getUniqueCustomerCount = async () => {
  const user = auth.currentUser;
  if (!user) return 0;

  const snapshot = await getDocs(collection(db, "users", user.uid, "chats"));
  const uniqueCustomerIds = new Set();
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.customerId) uniqueCustomerIds.add(data.customerId);
  });
  return uniqueCustomerIds.size;
};

export const getRecentMessages = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "users", user.uid, "chats"),
    orderBy("timestamp", "desc")
  );

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
