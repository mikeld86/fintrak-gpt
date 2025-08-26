import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import LoginPage from "@/pages/login-page-netlify";
import InventoryPage from "@/pages/inventory-page";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={LoginPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route component={NotFound} />
          </Switch></TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
