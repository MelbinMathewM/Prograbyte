import { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@/contexts/theme-context";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { payCourse, saveEnrolledCourse } from "@/api/checkout";
import { UserContext } from "@/contexts/user-context";
import { Course } from "@/types/course";
import { fetchCourseDetail } from "@/api/course";

const CheckoutPage: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(UserContext) ?? {};
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetchCourseDetail(courseId as string);
                setCourse(response.course);
            } catch (err) {
                console.error("Error fetching course details", err);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !course) return;
        setLoading(true);

        try {
            const response = await payCourse(course.price, paymentMethod);
            if (paymentMethod === "card") {
                const result = await stripe.confirmCardPayment(response.clientSecret, {
                    payment_method: { card: elements?.getElement(CardElement)! },
                });

                if (result.error) {
                    console.error(result.error.message);
                } else if (result.paymentIntent?.status === "succeeded") {
                    await saveEnrolledCourse(courseId as string, user?.id as string, course.price, result.paymentIntent.id);
                    setPaymentSuccess(true);
                }
            } else if (paymentMethod === "upi" && response.upiLink) {
                window.location.href = response.upiLink;
            }
        } catch (error) {
            console.error("Payment failed", error);
        }
        setLoading(false);
    };

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <Confetti width={width} height={height} />
                <CheckCircle className="text-green-500" size={64} />
                <h2 className="text-2xl font-bold mt-4">Payment Successful! 🎉</h2>
                <p className="text-lg text-gray-500 mt-2">You have successfully enrolled in {course?.title}.</p>
                <Link to={`/courses/${courseId}`} className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500">
                    Go to Course
                </Link>
            </div>
        );
    }

    return (

        <div className={`mx-auto p-6 shadow-lg rounded-lg transition-all duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <nav className={`${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"} p-4 rounded mb-6 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <Link to={`/courses/${courseId}`} className="font-bold hover:text-blue-500">{course?.title}</Link>
                <ChevronRight size={16} />
                <span>Checkout</span>
            </nav>
            <div className="flex w-full justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Checkout</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
                        }`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>
            <div className={`mx-auto p-6 shadow-lg rounded-lg transition-all duration-300 grid grid-cols-1 sm:grid-cols-2 gap-8 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>

                {/* Left Section - Course Details */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                    {/* Course Poster */}
                    <div className="w-full">
                        <img
                            src={course?.poster_url}
                            alt={course?.title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>

                    {/* Course Details */}
                    <div className="w-full sm:w-2/3">
                        <h2 className="text-2xl font-bold">{course?.title}</h2>

                        {/* Additional Course Info */}
                        <div className="mt-4 space-y-2 text-gray-600">
                            <p><span className="font-semibold">Instructor:</span> {course?.tutor_id}</p>
                            <p><span className="font-semibold">Rating:</span> {course?.rating} ⭐</p>
                        </div>

                        {/* Price */}
                        <p className="text-2xl font-bold text-green-500 mt-4">
                            ₹{course?.price} <span className="text-lg line-through text-gray-400">₹{course?.originalPrice}</span>
                        </p>
                    </div>
                </div>


                {/* Right Section - Checkout */}
                <div className={`p-6 sm:p-8 border rounded-lg shadow-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} `}>
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>

                    <label className="block font-semibold mb-2">Select Payment Method:</label>
                    <div className="flex gap-4 mt-2">
                        <label className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition ${paymentMethod === "card" ? "border-green-500" : "border-gray-300"} ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${paymentMethod === "card" ? "border-green-500" : "border-gray-400"}`}>
                                {paymentMethod === "card" && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                            </div>
                            Credit/Debit Card
                        </label>

                        <label className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition ${paymentMethod === "upi" ? "border-green-500" : "border-gray-300"} ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="upi"
                                checked={paymentMethod === "upi"}
                                onChange={() => setPaymentMethod("upi")}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${paymentMethod === "upi" ? "border-green-500" : "border-gray-400"}`}>
                                {paymentMethod === "upi" && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                            </div>
                            UPI
                        </label>
                    </div>

                    {paymentMethod === "card" && (
                        <div className={`p-3 border rounded-md mt-4 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                            <CardElement />
                        </div>
                    )}

                    <button
                        type="submit"
                        onClick={handlePayment}
                        disabled={!stripe || loading}
                        className="w-full py-3 mt-6 rounded-lg font-semibold transition-all duration-300 bg-green-700 hover:bg-green-600 text-white flex items-center justify-center"
                    >
                        {loading ? <span className="loader"></span> : "Pay Now"}
                    </button>
                </div>

            </div>

        </div>

    );
};

export default CheckoutPage;