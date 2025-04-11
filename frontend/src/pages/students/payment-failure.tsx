import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-100 dark:bg-gray-900">
            <XCircle className="text-red-600 w-20 h-20 mb-4" />
            <h1 className="text-3xl font-bold text-red-700 dark:text-white">Payment Failed! ❌</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                Something went wrong with your payment. Please try again.
            </p>
            <Button 
                className="mt-6 bg-red-500 text-white hover:bg-red-600" 
                onClick={() => navigate("/premium")}
            >
                Try Again
            </Button>
        </div>
    );
};

export default PaymentFailure;
