import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/theme-context";
import axiosInstance from "../../axios/axiosConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define course type
interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
}

const CheckoutPage: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    // Fetch course details
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get<Course>(`/course/courses/${courseId}`);
                setCourse(response.data);
            } catch (err) {
                console.error("Error fetching course details", err);
            }
        };
        fetchCourse();
    }, [courseId]);

    // Handle payment process
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !course) return;
        setLoading(true);

        try {
            // Step 1: Request PaymentIntent from backend
            const { data } = await axiosInstance.post<{ clientSecret: string; upiLink?: string }>(
                "/course/payments",
                { amount: course.price, method: paymentMethod }
            );

            console.log(data,'data');

            if (paymentMethod === "card") {
                // Step 2: Confirm payment via Card
                const result = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: { card: elements?.getElement(CardElement)! },
                });

                if (result.error) {
                    console.error(result.error.message);
                } else if (result.paymentIntent?.status === "succeeded") {
                    alert("Payment Successful! 🎉");
                }
            } else if (paymentMethod === "upi" && data.upiLink) {
                // Step 2: Redirect user to UPI link for payment
                window.location.href = data.upiLink;
            }
        } catch (error) {
            console.error("Payment failed", error);
        }
        setLoading(false);
    };

    return (
        <div className={`mx-auto p-6 shadow-lg rounded-lg transition-all duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <nav className={`${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <Link to={`/courses/${courseId}`} className="font-bold hover:text-blue-500">{course?.title}</Link>
                <ChevronRight size={16}/>
                <span>Checkout</span>
            </nav>
            <div className="flex w-full sm:max-w-6xl sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{course?.title}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
                        }`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>
            {course ? (
                <div className="w-full sm:max-w-6xl sm:mx-auto">
                    <p className="text-lg text-gray-500 mb-4">{course.description}</p>
                    <p className="text-2xl font-bold text-green-500 mb-4">
                        ₹{course.price} <span className="text-lg line-through text-gray-400">₹{course.originalPrice}</span>
                    </p>

                    {/* Payment Method Selection */}
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Select Payment Method:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as "card" | "upi")}
                            className="p-2 border rounded-md w-full bg-white text-gray-900"
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="upi">UPI</option>
                        </select>
                    </div>

                    <form onSubmit={handlePayment} className="mt-4">
                        {paymentMethod === "card" && (
                            <div className="p-3 border rounded-md bg-white text-gray-900">
                                <CardElement />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className={`w-full py-3 mt-4 rounded-lg font-semibold transition-all duration-300 ${isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-700 hover:bg-green-600"} text-white flex items-center justify-center`}
                        >
                            {loading ? <span className="loader"></span> : "Pay Now"}
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-center">Loading course details...</p>
            )}
        </div>
    );
};

export default CheckoutPage;
