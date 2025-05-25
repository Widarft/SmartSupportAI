import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { loginSchema } from "../../../utils/validationSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PasswordInput from "../../../components/input/PasswordInput";
import { FaHome } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => navigate("/welcome")}
          className="top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FaHome className="mr-1 mb-6" size={25} />
        </button>
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await loginUser(values.email, values.password);
              navigate("/testuser");
            } catch (err) {
              console.error(err);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded mb-3"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <PasswordInput
                name="password"
                label="Password"
                placeholder="Masukkan password"
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white p-2 rounded mt-10 transition duration-300"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              {/* <div className="flex justify-center mt-2 mb-4">
                <p
                  onClick={() => navigate("/register")}
                  className="text-sm  hover:text-blue-500"
                >
                  Belum memiliki akun?
                </p>
              </div> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
