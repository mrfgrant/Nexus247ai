import { Component, type ReactNode, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function reportClientError(payload: {
  type: string;
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}) {
  try {
    fetch("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function GlobalErrorHandlers() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportClientError({
        type: "window.onerror",
        message: event.message || "Unknown JS error",
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      reportClientError({
        type: "unhandledrejection",
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : "Unhandled promise rejection",
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || "Unknown render error" };
  }

  componentDidCatch(error: Error) {
    reportClientError({
      type: "ReactErrorBoundary",
      message: error.message || "React render crash",
      stack: error.stack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-testid="error-boundary-fallback"
          className="min-h-screen flex items-center justify-center bg-background p-6"
        >
          <div className="max-w-md w-full text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred. Our team has been notified. Please try refreshing the page.
            </p>
            <Button
              data-testid="button-reload-page"
              onClick={() => window.location.reload()}
              variant="default"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
