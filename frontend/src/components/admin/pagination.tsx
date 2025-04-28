import { Dispatch, SetStateAction } from "react";

interface PaginationType {
    currentPage: number,
    totalPages: number;
    setCurrentPage: Dispatch<SetStateAction<number>>
}

const AdminPagination = ({ currentPage, totalPages, setCurrentPage }: PaginationType) => {
    return (
        <div className="flex justify-center mt-6 pt-8.5 space-x-2">
            {currentPage > 1 && (
                <button
                    className="px-3 py-1 rounded border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white"
                    onClick={() => setCurrentPage((prev: number) => prev - 1)}
                >
                    Prev
                </button>
            )}

            {currentPage > 1 && (
                <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:text-gray-200 hover:bg-gray-500 hover:text-white"
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            )}

            <button className="px-4 py-1 rounded-md border border-blue-400 text-blue-600 hover:bg-blue-400 hover:text-white">
                {currentPage}
            </button>

            {currentPage < totalPages && (
                <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:text-gray-200 hover:bg-gray-500 hover:text-white"
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            )}

            {currentPage < totalPages && (
                <button
                    className="px-3 py-1 rounded border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white"
                    onClick={() => setCurrentPage((prev: number) => prev + 1)}
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default AdminPagination;
