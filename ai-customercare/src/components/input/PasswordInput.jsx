import { useState } from "react";
import { Field } from "formik";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";

const PasswordInput = ({ name, label, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block font-medium">{label}</label>
      <Field
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder || "Enter password"}
        className="w-full p-2 border rounded mb-1"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-9 text-sm text-gray-500"
      >
        {showPassword ? (
          <BiSolidShow className="text-xl" />
        ) : (
          <BiSolidHide className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
