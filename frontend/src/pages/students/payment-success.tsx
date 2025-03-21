import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-100 dark:bg-gray-900">
            <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
            <h1 className="text-3xl font-bold text-green-700 dark:text-white">Payment Successful! 🎉</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                Your payment has been processed successfully.
            </p>
            <Button 
                className="mt-6 bg-green-500 text-white hover:bg-green-600" 
                onClick={() => navigate("/profile")}
            >
                Go to Dashboard
            </Button>
        </div>
    );
};

export default PaymentSuccess;
