import { useTheme } from "@/contexts/theme-context";
import { ArrowDownRight, ArrowUpRight, IndianRupee, Plus, Minus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Breadcrumb from "./breadcrumb";
import HeaderWithBack from "./header-back";
import { fetchWallet } from "@/api/checkout";
import { UserContext } from "@/contexts/user-context";
import { IWallet } from "@/types/user";
import dayjs from "dayjs";

const WalletPage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const { user } = useContext(UserContext) ?? {};

    const [wallet, setWallet] = useState<IWallet | null>(null);
    const [page, setPage] = useState(1);

    const items_per_page = 12;
    const transactions = wallet?.transactions || [];
    const totalPages = Math.ceil(transactions.length / items_per_page);

    const paginatedTxns = transactions.slice(
        (page - 1) * items_per_page,
        page * items_per_page
    );

    const balance = transactions.reduce((acc, txn) => {
        return txn.type === "credit" ? acc + txn.amount : acc - txn.amount;
    }, 0);

    useEffect(() => {
        if (!user) return;
        const getWallet = async () => {
            try {
                const response = await fetchWallet(user.id as string);
                setWallet(response.wallet);
            } catch (err: any) {
                console.log(err.error);
            }
        };
        getWallet();
    }, [user]);

    return (
        <div className={`min-h-screen p-4 sm:p-8 ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
            {/* Breadcrumb */}
            <Breadcrumb
                isDark={isDark}
                items={[
                    { label: "Home", to: "/home" },
                    { label: "Profile", to: "/profile" },
                    { label: "Wallet" }
                ]}
            />

            {/* Title and Back Button */}
            <HeaderWithBack title="Wallet" isDark={isDark} />

            {/* Balance Card */}
            <div className={`rounded-sm p-6 mb-6 shadow-md border transition-all duration-300 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}>
                <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
                <p className="flex items-center gap-1 text-3xl font-bold text-green-400">
                    <IndianRupee /> {balance.toFixed(2)}
                </p>
            </div>

            {/* Transaction History */}
            <div className={`rounded-sm p-6 shadow-lg border ${isDark ? "bg-gray-850 border-gray-700" : "bg-white"}`}>
                <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

                {paginatedTxns?.length === 0 ? (
                    <p className="text-sm text-gray-400">No transactions found.</p>
                ) : (
                    <ul className="space-y-2 mb-4">
                        {paginatedTxns.map((txn) => (
                            <li
                                key={txn._id}
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
                                        <p className="text-xs text-gray-400">{dayjs(txn.date).format("DD MMM YYYY, hh:mm A")}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 font-bold ${txn.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                                    {txn.type === "credit" ? <Plus size={14} /> : <Minus size={14} />}
                                    <div className="flex items-center gap-0">
                                        <IndianRupee size={14} /> {txn.amount}
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
                        className={`px-3 py-1 rounded-sm text-sm font-semibold shadow ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-700"} ${page === 1 ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-300"}`}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-3 py-1 rounded-sm text-sm font-semibold shadow ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-700"} ${page === totalPages ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-300"}`}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
