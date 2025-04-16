import CheckoutPage from "@/components/students/checkout-part";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

const Checkout = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutPage />
            </Elements>
        </div>
    )
}

export default Checkout;