import { useContext, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Crown, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/configs/axiosConfig";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { User } from "@/types/user";
import Breadcrumb from "./breadcrumb";
import HeaderWithBack from "./header-back";
import { updateToPremium } from "@/api/profile";

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

      const response = await updateToPremium(user?.email);

      const { error } = await stripe.redirectToCheckout({ sessionId: response.sessionId });

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

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        isDark={isDark}
        items={[
          { label: "Home", to: "/home" },
          { label: "Profile", to: "/profile" },
          { label: `Premium` }
        ]}
      />

      {/* Title and Back Button */}
      <HeaderWithBack
        title="Premium"
        isDark={isDark}
      />

      <div className="flex flex-col items-center justify-center px-6 py-10 max-w-5xl mx-auto">
        <h1 className={`text-3xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          {isPremium ? "You're a Premium Member!" : "Upgrade to Premium"}
        </h1>
        <p className={`text-center text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {isPremium
            ? "Thank you for supporting us! Enjoy all premium features."
            : "Unlock exclusive features and premium content!"}
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 w-full">
          {/* Basic Plan */}
          <div className="sm:col-span-1 transform scale-95 opacity-90">
            <div className={`p-4 shadow rounded-sm border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
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
            <Card className={`p-6 transform scale-105 rounded-sm relative transition-all duration-300 border-4 shadow-2xl ${isDark ? "bg-gray-800 border-yellow-400" : "bg-white border-yellow-400"}`}>
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center">
                <Crown className="mr-1" size={14} /> Premium
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
