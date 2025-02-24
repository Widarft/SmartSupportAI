import { db, auth } from "../../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const addCategory = async (categoryName) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const categoryRef = collection(db, "users", user.uid, "categories");
    await addDoc(categoryRef, {
      name: categoryName,
      createdAt: new Date(),
    });

    return { success: true, message: "Kategori berhasil ditambahkan!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCategory = async (categoryId, newName) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const categoryRef = doc(db, "users", user.uid, "categories", categoryId);
    await updateDoc(categoryRef, {
      name: newName,
      updatedAt: new Date(),
    });

    return { success: true, message: "Kategori berhasil diupdate!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const categoryRef = doc(db, "users", user.uid, "categories", categoryId);
    await deleteDoc(categoryRef);

    return { success: true, message: "Kategori berhasil dihapus!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getUserCategories = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User tidak ditemukan. Harap login.");

    const categoryRef = collection(db, "users", user.uid, "categories");
    const querySnapshot = await getDocs(categoryRef);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return categories;
  } catch (error) {
    console.error("Error mengambil kategori:", error);
    return [];
  }
};
