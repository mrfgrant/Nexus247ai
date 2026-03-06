declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function gtag(...args: any[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

export function trackSignUp() {
  gtag("event", "sign_up", { method: "replit_auth" });
}

export function trackTrialStarted() {
  gtag("event", "trial_started", {
    trial_length: 3,
    tier: "pro",
  });
}

export function trackBeginCheckout(tier: string, value: number) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value,
    items: [{ item_name: `${tier}_plan`, quantity: 1, price: value }],
  });
}

export function trackPurchase(tier: string, value: number, transactionId?: string) {
  gtag("event", "purchase", {
    currency: "USD",
    value,
    transaction_id: transactionId || "",
    items: [{ item_name: `${tier}_plan`, quantity: 1, price: value }],
  });
}
