import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set — Stripe integration disabled");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const PRICE_TO_TIER: Record<string, string> = {
  "price_1T776nEBRMFySHqpEY8vdmE9": "basic",
  "price_1T777GEBRMFySHqpCBvns2rX": "pro",
  "price_1T778MEBRMFySHqpeyk2TGS4": "concierge",
};

export const TIER_TO_PRICE: Record<string, string> = {
  basic: "price_1T776nEBRMFySHqpEY8vdmE9",
  pro: "price_1T777GEBRMFySHqpCBvns2rX",
  concierge: "price_1T778MEBRMFySHqpeyk2TGS4",
};

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const profile = await storage.getVeteranProfile(userId);

  if (profile?.stripeCustomerId) {
    return profile.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { userId },
  });

  await storage.updateStripeCustomerId(userId, customer.id);

  return customer.id;
}
