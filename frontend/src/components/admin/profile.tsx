import { useContext } from "react";
import { AdminContext } from "@/contexts/admin-context";

const AdminProfilePart = () => {
  const { admin, logout } = useContext(AdminContext) || {};

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
        {/* Profile Icon */}
        <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white text-2xl font-bold rounded-full mx-auto">
          A
        </div>

        {/* Admin Info */}
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          {admin?.name || "Admin Name"}
        </h2>
        <p className="text-gray-500">{admin?.email || "admin@example.com"}</p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfilePart;
