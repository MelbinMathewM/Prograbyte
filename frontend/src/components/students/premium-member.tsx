import React, { useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/card";
import axiosInstance from "../../configs/axiosConfig";
import { UserContext } from "../../contexts/user-context";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PremiumPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext) ?? {}; // Ensure context updates

    const handleUpgrade = async () => {
        if (!user?.email) {
            toast.error("User not found. Please log in.");
            return;
        }
        setLoading(true);

        try {
            const stripe = await stripePromise;
            if (!stripe) {
                toast.error("Stripe failed to load.");
                setLoading(false);
                return;
            }

            console.log(user.email);

            const { data } = await axiosInstance.post("/user/payment/create-checkout-session", {
                email: user.email,
            });

            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("Failed to initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Polling function to check user premium status after Stripe checkout
    const checkPremiumStatus = async () => {
        try {
            const { data } = await axiosInstance.get("/user/profile");
            if (data.isPremium) {
                toast.success("🎉 You are now a Premium Member!");
            }
        } catch (error) {
            console.error("Error checking premium status", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Upgrade to Premium</h1>
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 mt-2">
                Unlock exclusive features and premium content!
            </p>

            <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {/* Free Plan */}
                <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardContent>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Basic</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Limited Access</p>
                        <h3 className="text-xl font-bold mt-4">Free</h3>
                        <Button className="w-full mt-4" onClick={() => navigate("/profile")}>
                            Get Started
                        </Button>
                    </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 border border-yellow-400">
                    <CardContent>
                        <h2 className="text-2xl font-semibold text-yellow-500">Premium</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Full access to all features.</p>
                        <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                                <CheckCircle className="text-green-500 mr-2" /> HD Courses
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="text-green-500 mr-2" /> Live Sessions
                            </li>
                        </ul>
                        <h3 className="text-xl font-bold mt-4">$9.99/month</h3>
                        <Button 
                            className="w-full mt-4 bg-yellow-500 text-white hover:bg-yellow-600" 
                            onClick={handleUpgrade} 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Upgrade Now"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PremiumPage;
