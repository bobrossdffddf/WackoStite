import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { TerminalShell } from "@/components/TerminalShell";

import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Join from "@/pages/Join";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/join" component={Join} />
      <Route path="/room/:id">
        {(params) => (
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-4xl font-mono">Room: {params.id}</h1>
          </div>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mode, setMode] = useState<"terminal" | "web">("terminal");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {mode === "terminal" ? (
          <TerminalShell onWeb={() => setMode("web")} />
        ) : (
          <div className="relative">
            <Router />
            <button 
              onClick={() => setMode("terminal")}
              className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded font-mono text-xs z-[60] hover:bg-primary/90"
            >
              [esc] terminal
            </button>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
