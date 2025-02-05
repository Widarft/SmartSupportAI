export const handleAuthError = (error) => {
  if (error.code) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email sudah digunakan. Gunakan email lain.";
      case "auth/weak-password":
        return "Password terlalu lemah. Gunakan kombinasi yang lebih kuat.";
      case "auth/user-not-found":
        return "Email tidak ditemukan. Silakan daftar terlebih dahulu.";
      case "auth/wrong-password":
        return "Password salah. Coba lagi.";
      case "auth/user-not-found":
        return "Email tidak ditemukan. Silakan daftar terlebih dahulu.";
      case "auth/wrong-password":
        return "Password salah. Coba lagi.";
      case "auth/invalid-credential":
        return "Kredensial tidak valid. Periksa email dan password.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Silakan coba lagi nanti.";
      default:
        return "Terjadi kesalahan otentikasi. Coba lagi.";
    }
  }

  return "Terjadi kesalahan. Coba lagi nanti.";
};
