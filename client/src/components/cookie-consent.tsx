import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Shield } from "lucide-react";

const STORAGE_KEY = "nexus247_cookies_accepted";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  function handleAccept() {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setVisible(false);
  }

  function handleDecline() {
    try { localStorage.setItem(STORAGE_KEY, "false"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      data-testid="banner-cookie-consent"
      className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-500"
    >
      <div className="bg-[#0D2137] border-t-2 border-[#D4A43E] shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          <Shield className="w-5 h-5 text-[#D4A43E] shrink-0 hidden sm:block" />
          <p className="text-sm text-white/90 flex-1 text-center sm:text-left">
            We use cookies to improve your experience. By continuing to use this site, you consent to our use of cookies.{" "}
            <Link
              href="/terms"
              data-testid="link-cookie-terms"
              className="text-[#D4A43E] underline underline-offset-2 hover:text-[#EAC76A]"
            >
              Learn more
            </Link>
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              data-testid="button-cookie-decline"
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-white/70 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
            >
              Decline
            </button>
            <button
              data-testid="button-cookie-accept"
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-bold text-[#0D2137] bg-[#D4A43E] rounded-md hover:bg-[#EAC76A] transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
