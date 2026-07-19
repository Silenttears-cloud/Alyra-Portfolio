import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import "@fontsource-variable/inter-tight/index.css";
import "@fontsource/jetbrains-mono/300.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";

import interTightWoff2 from "@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2?url";
import instrumentSerifWoff2 from "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url";
import jetbrainsMonoWoff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url";
import fraunces400Woff2 from "@fontsource/fraunces/files/fraunces-latin-400-normal.woff2?url";
import fraunces500Woff2 from "@fontsource/fraunces/files/fraunces-latin-500-normal.woff2?url";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { useHydrated } from "../lib/useHydrated";
import { AnimusCanvas } from "../scene/AnimusCanvas";
import { HUD } from "../ui/HUD";
import { Reticle } from "../ui/Reticle";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="hud-label mt-4">PAGE NOT FOUND</p>
        <a
          href="/"
          className="mt-6 inline-flex border border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="hud-label">Something Broke</p>
        <h1 className="mt-4 font-display text-2xl">Please try again.</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background"
          >
            Retry
          </button>
          <a
            href="/"
            className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
          >
            Return
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Ayushi Raj" },
      {
        name: "keywords",
        content:
          "Ayushi Raj, AI Developer, Full Stack Developer, Python, React, FastAPI, Spring Boot, Gemini, portfolio, BCA Amity",
      },
      { property: "og:site_name", content: "Ayushi Raj — AI & Full-Stack Developer" },
      { name: "theme-color", content: "#f7f4fb" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preload", as: "font", type: "font/woff2", href: interTightWoff2, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: instrumentSerifWoff2, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: jetbrainsMonoWoff2, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: fraunces400Woff2, crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: fraunces500Woff2, crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const hydrated = useHydrated();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [desync, setDesync] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setDesync(true);
    setTimeout(() => setTheme((t) => (t === "light" ? "dark" : "light")), 180);
    setTimeout(() => setDesync(false), 700);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {hydrated && <AnimusCanvas dark={theme === "dark"} />}

      <div className="grain pointer-events-none fixed inset-0 z-30" aria-hidden />

      {hydrated && <HUD theme={theme} onToggleTheme={toggleTheme} />}
      {hydrated && <Reticle />}

      {desync && <div className="desync-flash" />}

      <main className="relative z-10">
        <Outlet />
      </main>

      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
            borderRadius: 8,
          },
        }}
      />
    </QueryClientProvider>
  );
}
