import { useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { IndianRupee, Wallet2, CreditCard, BadgePercent } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { fetchCourseDetail } from "@/api/course";
import { Course } from "@/types/course";
import Breadcrumb from "./breadcrumb";
import HeaderWithBack from "./header-back";
import { payByWallet, saveEnrolledCourse } from "@/api/checkout";
import { applyCoupon } from "@/api/coupon";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { user } = useContext(UserContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">("stripe");

    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState<number>(0);
    const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

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

    const getBaseAmount = () => {
        if (!course) return 0;
        const offerPrice = course.offer
            ? Math.floor(course.price - (course.price * course.offer.discount) / 100)
            : course.price;
        return offerPrice;
    };

    const getFinalAmount = () => {
        const baseAmount = getBaseAmount();
        if (couponDiscount > 0) {
            return Math.floor(baseAmount - (baseAmount * couponDiscount) / 100);
        }
        return baseAmount;
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code.");
            return;
        }

        setApplyingCoupon(true);

        try {
            const response = await applyCoupon(couponCode, user?.id as string);

            if (response.success) {
                setCouponDiscount(response?.coupon?.discount);
                toast.success(`Coupon Applied! ${response.coupon.discount}% OFF`);
                setIsCouponApplied(true)
            }
        } catch (error: any) {
            toast.error(error.error);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRevokeCoupon = async () => {
        setCouponDiscount(0);
        toast.success(`Coupon Revoked!`);
        setIsCouponApplied(false);
    }

    const handleCheckout = async () => {
        if (!user?.email) {
            toast.error("Please log in to continue.");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === "stripe") {
                const stripe = await stripePromise;
                if (!stripe) {
                    toast.error("Stripe failed to load.");
                    return;
                }

                const finalAmount = getFinalAmount();

                const response = await saveEnrolledCourse(user.email, courseId as string, user.id, course?.tutor_id as string, course?.title as string, finalAmount, couponCode);

                const { error } = await stripe.redirectToCheckout({ sessionId: response.sessionId });
                if (error) toast.error(error.message);
            } else {
                const amount =  getFinalAmount();
                const response = await payByWallet(courseId as string, user?.id as string, course?.tutor_id as string, amount, couponCode);
                if (response.success) {
                    toast.success(response.message);
                    navigate("/payment-success");
                }
            }
        } catch (error: any) {
            toast.error(error.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`mx-auto p-6 shadow-lg transition-all duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <Breadcrumb
                isDark={isDark}
                items={[
                    { label: "Home", to: "/home" },
                    { label: "Courses", to: "/courses" },
                    { label: `${course?.title}`, to: `/courses/${courseId}` },
                    { label: "Checkout" }
                ]}
            />

            <HeaderWithBack title="Checkout" isDark={isDark} />

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${isDark ? "text-white" : "text-gray-900"}`}>
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                    <div className="w-full">
                        <img
                            src={course?.poster_url}
                            alt={course?.title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>

                    <div className="w-full sm:w-2/3">
                        <h2 className="text-2xl font-bold">{course?.title}</h2>
                        <div className="mt-4 space-y-2 text-gray-500">
                            <p><span className="font-semibold">Category:</span> {course?.category_id.name}</p>
                            <p><span className="font-semibold">Rating:</span> {course?.rating} ⭐</p>
                        </div>

                        <p className="flex flex-wrap items-center mt-3 text-green-500 text-xl font-semibold gap-x-2">
                            <IndianRupee size={18} />
                            {getFinalAmount()}
                            {course?.offer && (
                                <span className="text-gray-400 text-base line-through ml-2 flex items-center">
                                    <IndianRupee size={16} /> {course.price}
                                </span>
                            )}
                        </p>

                        {couponDiscount > 0 && (
                            <div className="mt-2 text-sm text-yellow-500 font-medium flex items-center gap-2">
                                <BadgePercent size={16} /> Coupon Applied: {couponDiscount}% OFF
                            </div>
                        )}
                    </div>
                </div>

                <div className={`p-6 sm:p-8 border rounded-lg shadow-lg ${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>

                    <label className="block font-semibold mb-2">Apply Coupon:</label>
                    <div className="flex gap-1">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className={`p-3 rounded-md border w-full ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
                        />
                        {isCouponApplied ? <button
                            onClick={handleRevokeCoupon}
                            className={`p-3 rounded-sm bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300`}
                        >
                            Revoke
                        </button> : 
                        <button
                            onClick={handleApplyCoupon}
                            disabled={applyingCoupon}
                            className={`p-3 rounded-sm bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-300`}
                        >
                            {applyingCoupon ? "Applying..." : "Apply"}
                        </button>}
                    </div>

                    <label className="block font-semibold mt-6 mb-2">Select Payment Method:</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <button
                            onClick={() => setPaymentMethod("stripe")}
                            className={`flex items-center gap-2 p-3 border rounded-sm justify-center transition-all duration-300 
                                ${paymentMethod === "stripe" ? "border-green-500 ring-2 ring-green-400" : "border-gray-300"} 
                                ${isDark ? "bg-gray-800 text-white hover:border-green-500" : "bg-white text-gray-900 hover:border-green-500"}`}
                        >
                            <CreditCard size={18} />
                            Stripe
                        </button>

                        <button
                            onClick={() => setPaymentMethod("wallet")}
                            className={`flex items-center gap-2 p-3 border rounded-sm justify-center transition-all duration-300 
                                ${paymentMethod === "wallet" ? "border-green-500 ring-2 ring-green-400" : "border-gray-300"} 
                                ${isDark ? "bg-gray-800 text-white hover:border-green-500" : "bg-white text-gray-900 hover:border-green-500"}`}
                        >
                            <Wallet2 size={18} />
                            Wallet
                        </button>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`w-full py-3 mt-6 rounded-sm font-semibold transition-all duration-300 
                            ${loading ? "bg-gray-500" : "bg-green-700 hover:bg-green-600"} 
                            text-white flex items-center justify-center`}
                    >
                        {loading
                            ? "Processing..."
                            : `Pay ₹${getFinalAmount()} with ${paymentMethod === "stripe" ? "Stripe" : "Wallet"}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage
