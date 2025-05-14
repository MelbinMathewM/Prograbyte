import { useEffect, useState } from "react";
import axios from "axios";
import { getPaymentData, payTutor } from "@/api/payments";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface PayoutItem {
    _id: string;
    type: "course" | "live";
    source_id: string;
    amount: number;
    tutorShare: number;
    adminShare: number;
    createdAt: string;
}

interface Payout {
    _id: string;
    totalTutorShare: number;
    totalAdminShare: number;
    totalAmount: number;
    payouts: PayoutItem[];
    tutor: {
        user: {
            name: string;
            username: string;
            _id: string;
        }
    };
}

const PaymentPart = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loadingPayoutId, setLoadingPayoutId] = useState<string | null>(null); // Track loading for specific payout

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const response = await getPaymentData();
                console.log(response.payouts);
                setPayouts(response.payouts);
            } catch (err: any) {
                console.error(err.error);
            }
        };
        fetchPayouts();
    }, []);

    const markAsPaid = async (payoutId: string) => {
        setLoadingPayoutId(payoutId); // Set the loading state for the specific payout
        
        try {
            const response = await payTutor(payoutId);
            toast.success(response.message);
            // await fetchPayouts(); // Refresh payouts after marking as paid
        } catch (err: any) {
            toast.error(err.error);
        } finally {
            setLoadingPayoutId(null); // Reset loading state
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Monthly Payouts</h2>

            <div className="space-y-8">
                {payouts.map((payout) => (
                    <div key={payout._id} className="p-6 border rounded shadow bg-white">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">
                                {payout.tutor.user.name} (
                                <Link
                                    to={`/admin/tutors/${payout.tutor.user._id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    @{payout.tutor.user.username}
                                </Link>
                                )
                            </h3>
                            <p className="text-gray-500">Total Courses Sold: {payout.payouts.length}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-4">
                            <div>Total Revenue: ₹{payout.totalAmount.toFixed(2)}</div>
                            <div>Tutor Earnings: ₹{payout.totalTutorShare.toFixed(2)}</div>
                            <div>Admin Earnings: ₹{payout.totalAdminShare.toFixed(2)}</div>
                        </div>

                        <table className="w-full text-left text-sm mt-4">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4">Course</th>
                                    <th className="py-2 px-4">Amount</th>
                                    <th className="py-2 px-4">Tutor Share</th>
                                    <th className="py-2 px-4">Admin Share</th>
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payout.payouts.map((item, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="py-2 px-4">
                                            {item.type === "course" ? (
                                                <Link to={`/admin/categories/courses/${item.source_id}`} className="text-blue-600 hover:underline">
                                                    View Course
                                                </Link>
                                            ) : (
                                                <span>{item.source_id}</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4">₹{item.amount.toFixed(2)}</td>
                                        <td className="py-2 px-4">₹{item.tutorShare.toFixed(2)}</td>
                                        <td className="py-2 px-4">₹{item.adminShare.toFixed(2)}</td>
                                        <td className="py-2 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">
                                            {loadingPayoutId === item._id ? (
                                                // Show dummy UI when loading
                                                <button
                                                    className="text-white px-4 py-2 rounded bg-gray-400 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Processing...
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-white px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                                                    onClick={() => markAsPaid(item._id)}
                                                >
                                                    Mark As Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentPart;
