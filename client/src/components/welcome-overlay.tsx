import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const STORAGE_KEY = "nexus247_welcome_shown";

export function WelcomeOverlay({ onDismiss }: { onDismiss?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem(STORAGE_KEY);
      if (shown) return;
    } catch { return; }

    const showTimer = setTimeout(() => setVisible(true), 300);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible || fadeOut) return;
    const autoClose = setTimeout(() => dismiss(), 8000);
    return () => clearTimeout(autoClose);
  }, [visible, fadeOut]);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 400);
  }

  if (!visible) return null;

  return (
    <div
      data-testid="overlay-welcome"
      className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-400 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      onClick={dismiss}
    >
      <div className="absolute inset-0 bg-[#0D2137]/85 backdrop-blur-sm" />

      <div
        className={`relative max-w-md w-full mx-6 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${fadeOut ? "scale-95" : "scale-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0D2137] border border-[#D4A43E]/30 rounded-xl">
          <div className="h-1 bg-[#D4A43E]" />

          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#D4A43E]/15 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-8 h-8 text-[#D4A43E]" />
            </div>

            <h2
              data-testid="text-welcome-title"
              className="text-2xl font-serif font-bold text-white mb-2 tracking-wide"
            >
              Welcome to Nexus<span className="text-[#D4A43E]">247</span>
            </h2>

            <p
              data-testid="text-welcome-message"
              className="text-white/80 leading-relaxed mb-6"
            >
              Thank you for your service. You've earned your benefits — let us help you claim them.
            </p>

            <button
              data-testid="button-welcome-enter"
              onClick={dismiss}
              className="w-full py-3 text-base font-bold text-[#0D2137] bg-[#D4A43E] rounded-lg hover:bg-[#EAC76A] transition-colors tracking-wide"
            >
              CONTINUE
            </button>
          </div>

          <div className="px-8 pb-6">
            <p className="text-xs text-white/40 text-center">
              Your AI Battle Buddy for VA Claims
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
