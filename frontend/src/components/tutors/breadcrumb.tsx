import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

interface BreadcrumbHeaderProps {
    paths: { label: string; href?: string }[];
    title: string;
}

const BreadcrumbHeader = ({ paths, title }: BreadcrumbHeaderProps) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    return (
        <>
            <nav
                className={`my-4 p-4 rounded text-sm flex items-center gap-1 ${
                    isDark ? "text-gray-300 bg-gray-700 shadow-lg" : "text-gray-600 bg-white shadow-lg"
                }`}
            >
                {paths.map((path, index) => (
                    <div key={index} className="flex items-center gap-1">
                        {path.href ? (
                            <Link to={path.href} className="hover:text-blue-500">
                                {path.label}
                            </Link>
                        ) : (
                            <span>{path.label}</span>
                        )}
                        {index !== paths.length - 1 && <ChevronRight size={16} />}
                    </div>
                ))}
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 flex items-center gap-2 rounded-sm font-bold bg-blue-500 text-white hover:bg-blue-600"
                >
                    <ChevronLeft size={16} /> Back
                </button>
            </div>
        </>
    );
};

export default BreadcrumbHeader;
