import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { fetchWallet } from "@/api/checkout";
import { TutorContext } from "@/contexts/tutor-context";
import { useTheme } from "@/contexts/theme-context";
import BreadcrumbHeader from "./breadcrumb";

interface ITransaction {
    _id: string;
    amount: number;
    type: "credit" | "debit";
    source: "course" | "premium";
    source_id?: string;
    description: string;
    date: string;
}

interface IWallet {
    balance: number;
    transactions: ITransaction[];
}

const WalletPage = () => {
    const [wallet, setWallet] = useState<IWallet | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { tutor } = useContext(TutorContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        if (!tutor) return;
        const fetchWalletData = async () => {
            setLoading(true);
            try {
                const response = await fetchWallet(tutor?.id as string);
                setWallet(response.wallet);
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to fetch wallet data.");
            } finally {
                setLoading(false);
            }
        };
        fetchWalletData();
    }, [tutor]);

    return (
        <div className={`p-4 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <BreadcrumbHeader
                paths={[
                    { label: "Dashboard", href: "/tutor/dashboard" },
                    { label: "Profile", href: "/tutor/profile"},
                    { label: "Wallet" }
                ]}
                title="Wallet"
            />


            {loading ? (
                <div>Loading...</div>
            ) : (
                wallet && (
                    <>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold">
                                Wallet Balance: ₹{wallet?.balance?.toFixed(2)}
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Transaction History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Date</th>
                                            <th className="py-2 px-4 border-b">Amount</th>
                                            <th className="py-2 px-4 border-b">Type</th>
                                            <th className="py-2 px-4 border-b">Source</th>
                                            <th className="py-2 px-4 border-b">Description</th>
                                            <th className="py-2 px-4 border-b">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wallet.transactions.length > 0 ? (
                                            wallet.transactions.map((transaction) => (
                                                <tr key={transaction._id} className={`${isDark ? "border-gray-700" : "border-gray-200"} border-t`}>
                                                    <td className="py-2 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
                                                    <td className="py-2 px-4">₹{transaction.amount.toFixed(2)}</td>
                                                    <td className="py-2 px-4 capitalize">{transaction.type}</td>
                                                    <td className="py-2 px-4 capitalize">{transaction.source}</td>
                                                    <td className="py-2 px-4">{transaction.description}</td>
                                                    <td className="py-2 px-4">
                                                        <Link
                                                            to={`/tutor/transactions/${transaction._id}`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-2 px-4 text-center">
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default WalletPage;
