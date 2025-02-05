import * as Yup from "yup";

export const registerSchema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .matches(/[A-Z]/, "Harus ada huruf besar")
    .matches(/[a-z]/, "Harus ada huruf kecil")
    .matches(/[0-9]/, "Harus ada angka")
    .matches(/[@$!%*?&]/, "Harus ada simbol (@$!%*?&)")
    .required("Password wajib diisi"),
});

export const loginSchema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});
