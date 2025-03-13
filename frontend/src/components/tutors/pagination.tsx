import { Dispatch, SetStateAction } from "react";
import { useTheme } from "../../contexts/theme-context";

interface PaginationType {
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ currentPage, totalPages, setCurrentPage }: PaginationType) => {
  const { theme } = useTheme();
  const isDark = theme.includes("dark");

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {currentPage > 1 && (
        <button
          className={`px-3 py-1 rounded ${isDark ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          onClick={() => setCurrentPage((prev: number) => prev - 1)}
        >
          Prev
        </button>
      )}

      {currentPage > 1 && (
        <button
          className={`px-4 py-2 border rounded-md ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      )}

      <button className={`px-4 py-2 border rounded-md ${isDark ? "bg-blue-500 text-white" : "bg-blue-600 text-white"}`}>
        {currentPage}
      </button>

      {currentPage < totalPages && (
        <button
          className={`px-4 py-2 border rounded-md ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      )}

      {currentPage < totalPages && (
        <button
          className={`px-3 py-1 rounded ${isDark ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          onClick={() => setCurrentPage((prev: number) => prev + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;