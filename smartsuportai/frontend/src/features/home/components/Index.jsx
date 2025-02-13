import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Update auth context
    setUser(null);
    // Redirect to landing page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                SmartSupportAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stats Cards */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800">
                Total Tickets
              </h3>
              <p className="text-2xl font-bold text-indigo-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">
                Open Tickets
              </h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">
                Pending Tickets
              </h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
