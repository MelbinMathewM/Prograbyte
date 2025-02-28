import { Dispatch, SetStateAction } from "react";

interface PaginationType {
    currentPage: number,
    totalPages: number;
    setCurrentPage: Dispatch<SetStateAction<number>>
}

const AdminPagination = ({ currentPage, totalPages, setCurrentPage }: PaginationType) => {
    return (
        <div className="flex justify-center mt-6 space-x-2">
            {currentPage > 1 && (
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setCurrentPage((prev: number) => prev - 1)}
                >
                    Prev
                </button>
            )}

            {currentPage > 2 && (
                <button
                    className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            )}

            <button className="px-4 py-2 border rounded-md bg-blue-600 text-white">
                {currentPage}
            </button>

            {currentPage < totalPages && (
                <button
                    className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            )}

            {currentPage < totalPages && (
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setCurrentPage((prev: number) => prev + 1)}
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default AdminPagination;
