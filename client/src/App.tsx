import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from 'react';
import Home from "./pages/Home";
import { LoadingScreen } from "./components/LoadingScreen";
import { ScrollProgress } from "./components/ScrollProgress";
import { CursorTrail } from "./components/CursorTrail";
import { AlyraAssistant } from "./components/AlyraAssistant";


import { AetherProvider } from "./contexts/AetherContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <AetherProvider>
          <TooltipProvider>
            {loading ? (
              <LoadingScreen onComplete={() => setLoading(false)} />
            ) : (
              <>
                <ScrollProgress />
                <AlyraAssistant />
                <div className="animate-asha-fade">
                  <CursorTrail />
                  <Toaster />
                  <Router />
                </div>
              </>
            )}
          </TooltipProvider>
        </AetherProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
