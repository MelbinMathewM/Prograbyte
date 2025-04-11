import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/theme-context";

const NotFound = () => {
    const navigate = useNavigate();
    const {theme} = useTheme();
    const isDark = theme.includes("dark");
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${isDark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
            <h1 className={`text-9xl font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>404</h1>
            <h2 className="text-3xl font-semibold mt-4">Oops! Page Not Found</h2>
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"} mt-2`}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium shadow-md hover:bg-indigo-700 transition-all"
            >
                Go to Homepage
            </Link>
            <button
                onClick={() => navigate(-1)}
                className={`flex mt-3 items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-indigo-400 hover:bg-indigo-500 hover:text-white" : "text-indigo-500 hover:bg-indigo-500 hover:text-white"}`}
            >
                <ChevronLeft size={16} />
                Back
            </button>
        </div>
    );
};

export default NotFound;
