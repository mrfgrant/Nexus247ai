import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight } from "lucide-react";

const SESSION_KEY = "nexus247_exit_shown";
const MIN_TIME_ON_PAGE = 10000;

export function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch { return; }

    const timer = setTimeout(() => setReady(true), MIN_TIME_ON_PAGE);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!ready) return;
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch { return; }
      if (e.clientY > 10) return;

      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
      setVisible(true);
    },
    [ready]
  );

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  function dismiss() {
    setVisible(false);
  }

  function handleCta() {
    window.location.href = "/api/login";
  }

  if (!visible) return null;

  return (
    <div
      data-testid="overlay-exit-intent"
      className="fixed inset-0 z-[80] flex items-center justify-center animate-in fade-in duration-300"
      onClick={dismiss}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative max-w-lg w-full mx-6 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0D2137] border border-[#D4A43E]/30 rounded-xl">
          <div className="h-1 bg-[#D4A43E]" />

          <button
            data-testid="button-exit-close"
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 pt-8 pb-6">
            <h2
              data-testid="text-exit-title"
              className="text-2xl font-serif font-bold text-white mb-4"
            >
              Wait — Don't Leave{" "}
              <span className="text-[#D4A43E]">Empty-Handed</span>
            </h2>

            <p
              data-testid="text-exit-message"
              className="text-white/80 leading-relaxed mb-3"
            >
              Starting your claim costs <strong className="text-white">nothing</strong>. You get{" "}
              <strong className="text-[#D4A43E]">3 full days</strong> to kick the tires — no credit card, no commitment.
            </p>

            <p className="text-white/70 leading-relaxed mb-6">
              You've already earned these benefits. Let us help you claim them.
            </p>

            <button
              data-testid="button-exit-cta"
              onClick={handleCta}
              className="w-full py-3.5 text-base font-bold text-[#0D2137] bg-[#D4A43E] rounded-lg hover:bg-[#EAC76A] transition-colors tracking-wide flex items-center justify-center gap-2"
            >
              START MY FREE TRIAL
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              data-testid="button-exit-dismiss"
              onClick={dismiss}
              className="w-full mt-3 py-2 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              No thanks, I'll pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
