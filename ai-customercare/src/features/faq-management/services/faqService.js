import { db, auth } from "../../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  where,
} from "firebase/firestore";

export const addFAQ = async (question, answer, category) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const faqRef = collection(db, "users", user.uid, "faqs");
    await addDoc(faqRef, {
      question,
      answer,
      category,
      createdAt: new Date(),
    });

    return { success: true, message: "FAQ berhasil ditambahkan!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateFAQ = async (faqId, data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const faqRef = doc(db, "users", user.uid, "faqs", faqId);
    await updateDoc(faqRef, {
      ...data,
      updatedAt: new Date(),
    });

    return { success: true, message: "FAQ berhasil diupdate!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteFAQ = async (faqId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const faqRef = doc(db, "users", user.uid, "faqs", faqId);
    await deleteDoc(faqRef);

    return { success: true, message: "FAQ berhasil dihapus!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPaginatedFAQs = async (
  pageSize = 10,
  sortOrder = "newest",
  lastVisible = null,
  firstVisible = null,
  direction = "first",
  filterCategory = ""
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    console.log("Fetching FAQs with params:", {
      pageSize,
      sortOrder,
      direction,
      filterCategory,
    });

    const faqRef = collection(db, "users", user.uid, "faqs");

    let queryConstraints = [];

    if (filterCategory && filterCategory.trim() !== "") {
      console.log("Adding category filter:", filterCategory);
      queryConstraints.push(where("category", "==", filterCategory));
    }

    const sortField = "createdAt";
    const sortDirection = sortOrder === "newest" ? "desc" : "asc";
    queryConstraints.push(orderBy(sortField, sortDirection));

    if (direction === "next" && lastVisible) {
      queryConstraints.push(startAfter(lastVisible));
      queryConstraints.push(limit(pageSize));
    } else if (direction === "prev" && firstVisible) {
      queryConstraints.push(endBefore(firstVisible));
      queryConstraints.push(limitToLast(pageSize));
    } else {
      queryConstraints.push(limit(pageSize));
    }

    const q = query(faqRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);

    console.log(`Found ${querySnapshot.docs.length} documents`);

    const faqs = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("FAQ data:", {
        id: doc.id,
        category: data.category,
      });
      return {
        id: doc.id,
        ...data,
      };
    });

    const newFirstVisible = querySnapshot.docs[0] || null;
    const newLastVisible =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    let hasMore = querySnapshot.docs.length === pageSize;

    if (direction === "first" && querySnapshot.docs.length < pageSize) {
      hasMore = false;
    }

    return {
      faqs,
      firstVisible: newFirstVisible,
      lastVisible: newLastVisible,
      hasMore,
    };
  } catch (error) {
    console.error("Error mengambil FAQ:", error);
    return { faqs: [], firstVisible: null, lastVisible: null, hasMore: false };
  }
};

export const getFAQsCount = async (filterCategory = "") => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const faqRef = collection(db, "users", user.uid, "faqs");

    let q = faqRef;
    if (filterCategory && filterCategory.trim() !== "") {
      q = query(faqRef, where("category", "==", filterCategory));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error("Error mengambil jumlah FAQ:", error);
    return 0;
  }
};

export const getUserFAQs = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const faqRef = collection(db, "users", user.uid, "faqs");
    const querySnapshot = await getDocs(faqRef);
    const faqs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return faqs;
  } catch (error) {
    console.error("Error mengambil FAQ:", error);
    return [];
  }
};
