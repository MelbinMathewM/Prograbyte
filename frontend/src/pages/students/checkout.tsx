import CheckoutPage from "../../components/students/checkout-part";
import StudentNavbar from "../../components/students/navbar";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

const Checkout = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <Elements stripe={stripePromise}>
                    <CheckoutPage />
                </Elements>
            </div>

        </div>
    )
}

export default Checkout;