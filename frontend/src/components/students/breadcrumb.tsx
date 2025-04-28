import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isDark?: boolean;
}

const Breadcrumb = ({ items, isDark = false }: BreadcrumbProps) => {
  return (
    <nav
      className={`p-6 rounded mb-4 text-sm flex items-center gap-2
        ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="font-bold hover:text-blue-500">
              {item.label}
            </Link>
          ) : (
            <span
              className={`font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRight size={16} />}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
