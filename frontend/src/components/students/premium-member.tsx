import { useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ChevronLeft, ChevronRight, Crown, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/configs/axiosConfig";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { User } from "@/types/user";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PremiumPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext) ?? {};
    const [isPremium, setIsPremium] = useState(user?.isPremium ?? false);
    const [userData, setUserData] = useState<User | null>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        if (user) {
            setUserData({
                id: user.id,
                username: user.username,
                isPremium: user.isPremium
            });
        }
    }, [user]);

    useEffect(() => {
        setIsPremium(userData?.isPremium ?? false);
    }, [userData]);

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

    const handleRevoke = async () => {
        try {
            const res = await axiosInstance.patch("/user/revoke-premium");
            if (res.status === 200) {
                toast.info("Premium membership revoked.");
                // setUser && setUser({ ...user, isPremium: false });
                setIsPremium(false);
            }
        } catch (error) {
            toast.error("Failed to revoke premium status.");
        }
    };

    return (
        <div className={`min-h-screen px-4 py-10 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>

          <nav className={`p-6 rounded mb-4 flex items-center ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"}`}>
            <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
            <ChevronRight size={16} />
            <Link to="/profile" className="font-bold hover:text-blue-500">Profile</Link>
            <ChevronRight size={16} />
            <span>Profile</span>
          </nav>
      
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Premium</h2>
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${
                isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>
          </div>
      
          <div className="max-w-5xl w-full items-center justify-center">
            <h1 className={`text-4xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {isPremium ? "🎉 You're a Premium Member!" : "Upgrade to Premium"}
            </h1>
            <p className={`text-center text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {isPremium
                ? "Thank you for supporting us! Enjoy all premium features."
                : "Unlock exclusive features and premium content!"}
            </p>
      
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 items-start justify-center">
              {/* Basic Plan */}
              <div className="sm:col-span-1 transform scale-95 opacity-90">
                <div className={`p-4 shadow rounded-xl h-full border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <CardContent>
                    <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Basic</h2>
                    <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Limited Access</p>
                    <h3 className="text-lg font-bold mt-3">Free</h3>
                    <Button className="w-full mt-4" onClick={() => navigate("/profile")}>
                      Get Started
                    </Button>
                  </CardContent>
                </div>
              </div>
      
              {/* Premium Plan */}
              <div className="sm:col-span-2">
                <Card className={`p-6 transform scale-105 rounded-xl relative transition-all duration-300 border-4 shadow-2xl ${isDark ? "bg-gray-800 border-yellow-400" : "bg-white border-yellow-400"}`}>
                  <div className="absolute top-4 right-4 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                    <Crown className="inline-block mr-1" size={14} /> Premium
                  </div>
                  <CardContent>
                    <h2 className="text-3xl font-semibold text-yellow-500">Premium</h2>
                    <p className={`mt-2 text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Full access to all features.
                    </p>
                    <ul className={`mt-4 space-y-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" /> HD Courses
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" /> Live Sessions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" /> Premium Support
                      </li>
                    </ul>
                    <div className="flex items-center text-xl font-bold mt-4 text-yellow-600">
                      <IndianRupee size={16} className="mr-1" />
                      199/month
                    </div>
                    {!isPremium ? (
                      <Button
                        className="w-full mt-4 bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={handleUpgrade}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Upgrade Now"}
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        className="w-full mt-4"
                        onClick={handleRevoke}
                      >
                        Revoke Premium
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default PremiumPage;
