import { db, auth } from "../../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
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
