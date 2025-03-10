import Stripe from "stripe";
import { env } from "./env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, { apiVersion: "2025-02-24.acacia" });

export default stripe;