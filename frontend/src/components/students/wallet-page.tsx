import { useTheme } from "@/contexts/theme-context";
import {
    ChevronLeft,
    ChevronRight,
    ArrowDownRight,
    ArrowUpRight,
    IndianRupee,
    Plus,
    Minus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../ui/button";

const transactions = [
    { id: 1, type: "credit", amount: 1200, date: "2025-04-20", description: "Course Payment" },
    { id: 2, type: "debit", amount: 500, date: "2025-04-18", description: "Withdrawal" },
    { id: 3, type: "credit", amount: 800, date: "2025-04-15", description: "Course Payment" },
    { id: 4, type: "credit", amount: 900, date: "2025-04-12", description: "Course Payment" },
    { id: 5, type: "debit", amount: 300, date: "2025-04-10", description: "Service Fee" },
    { id: 6, type: "credit", amount: 700, date: "2025-04-08", description: "Referral Bonus" },
];

const WalletPage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const items_per_page = 2;
    const totalPages = Math.ceil(transactions.length / items_per_page);
    const paginatedTxns = transactions.slice(
        (page - 1) * items_per_page,
        page * items_per_page,
    );

    const balance = transactions.reduce((acc, txn) => {
        return txn.type === "credit" ? acc + txn.amount : acc - txn.amount;
    }, 0);

    return (
        <div className={`min-h-screen p-4 sm:p-8 ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
            {/* Breadcrumb */}
            <nav className={`p-4 rounded mb-6 text-sm flex items-center ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/profile" className="font-bold hover:text-blue-500">Profile</Link>
                <ChevronRight size={16} />
                <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>Wallet</span>
            </nav>

            {/* Header */}
            <div className="flex w-full justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Wallet</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-1 shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft className="mt-0.5" size={16} />
                    Back
                </button>
            </div>

            {/* Balance Card */}
            <div className={`rounded-sm p-6 mb-6 shadow-md border transition-all duration-300 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}>
                <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
                <p className="flex items-center gp-2 text-3xl font-bold text-green-400"><IndianRupee />{balance.toFixed(2)}</p>
            </div>

            {/* Transaction History */}
            <div className={`rounded-sm p-6 shadow-lg border ${isDark ? "bg-gray-850 border-gray-700" : "bg-white"}`}>
                <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                {paginatedTxns.length === 0 ? (
                    <p className="text-sm text-gray-400">No transactions found.</p>
                ) : (
                    <ul className="space-y-2 mb-4">
                        {paginatedTxns.map((txn) => (
                            <li
                                key={txn.id}
                                className={`flex justify-between items-center p-3 rounded-sm border ${isDark ? "bg-gray-850 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-300"}`}
                            >
                                <div className="flex items-center gap-4">
                                    {txn.type === "credit" ? (
                                        <ArrowDownRight size={20} className="text-green-400" />
                                    ) : (
                                        <ArrowUpRight size={20} className="text-red-400" />
                                    )}
                                    <div>
                                        <p className="font-medium">{txn.description}</p>
                                        <p className="text-xs text-gray-400">{txn.date}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 font-bold ${txn.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                                    {txn.type === "credit" ? <Plus size={14}/> : <Minus size={14}/>}
                                    <div className="flex items-center gap-0">
                                        <IndianRupee size={14} />{txn.amount}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-end gap-2">
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={`px-3 py-1 rounded-sm text-sm font-semibold shadow ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-700"} ${page === 1 ? "opacity-10 cursor-not-allowed hover:bg-transaparent" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-300"}`}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-3 py-1 rounded-sm text-sm font-semibold shadow ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-700"} ${page === totalPages ? "opacity-50 cursor-not-allowed hover:bg-transparent" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-300"}`}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
