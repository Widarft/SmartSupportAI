import { auth } from "../../../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import Swal from "sweetalert2";
import { handleAuthError } from "../../../utils/handleAuthError";

// Registrasi User
export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await signOut(auth);

    Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil!",
      text: "Silakan login untuk melanjutkan.",
    });
  } catch (error) {
    const errorMessage = handleAuthError(error);

    Swal.fire({
      icon: "error",
      title: "Registrasi Gagal!",
      text: errorMessage,
    });

    throw error;
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang, ${userCredential.user.email}!`,
    });

    return userCredential.user;
  } catch (error) {
    const errorMessage = handleAuthError(error);

    Swal.fire({
      icon: "error",
      title: "Login Gagal!",
      text: errorMessage,
    });

    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
    Swal.fire({
      icon: "success",
      title: "Logout Berhasil!",
      text: `Sampai ketemu lagi!`,
    });
  } catch (error) {
    throw error;
  }
};
