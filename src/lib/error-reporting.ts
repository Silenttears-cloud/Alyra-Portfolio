type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Generic error reporter for React error boundaries.
 * Logs errors to the console in development; can be wired to Sentry or
 * any other monitoring service in production.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}, options: ErrorOptions = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    error,
    context: {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    options: {
      mechanism: "react_error_boundary" as const,
      handled: false,
      severity: "error" as const,
      ...options,
    },
  };

  // In development, surface the full payload.
  if (import.meta.env.DEV) {
    console.error("[ErrorBoundary]", payload);
  }

  // TODO: wire to your preferred monitoring service (e.g. Sentry):
  // Sentry.captureException(error, { extra: payload.context });
}
