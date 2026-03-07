declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, any>) => void;
      page: () => void;
      identify: (params: Record<string, any>) => void;
    };
  }
}

function gtag(...args: any[]) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
}

function ttqTrack(event: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.ttq) {
    try {
      window.ttq.track(event, params);
    } catch {}
  }
}

export function trackSignUp() {
  gtag("event", "sign_up", { method: "replit_auth" });
  ttqTrack("CompleteRegistration");
}

export function trackTrialStarted() {
  gtag("event", "trial_started", {
    trial_length: 3,
    tier: "pro",
  });
  ttqTrack("Subscribe", { value: 0, currency: "USD" });
}

export function trackBeginCheckout(tier: string, value: number) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value,
    items: [{ item_name: `${tier}_plan`, quantity: 1, price: value }],
  });
  ttqTrack("InitiateCheckout", { value, currency: "USD", content_type: "product", content_id: `${tier}_plan` });
}

export function trackPurchase(tier: string, value: number, transactionId?: string) {
  gtag("event", "purchase", {
    currency: "USD",
    value,
    transaction_id: transactionId || "",
    items: [{ item_name: `${tier}_plan`, quantity: 1, price: value }],
  });
  ttqTrack("CompletePayment", { value, currency: "USD", content_type: "product", content_id: `${tier}_plan` });
}

export function trackForumRegistration() {
  gtag("event", "forum_registration");
}

export function trackForumQuestion(category: string) {
  gtag("event", "forum_question_asked", {
    event_category: "engagement",
    event_label: category
  });
}

export function trackForumUpvote() {
  gtag("event", "forum_upvote");
}
