
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResellerHub from "./pages/ResellerHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reseller-hub" element={<ResellerHub />} />
          <Route path="/careers" element={<Index />} />
          <Route path="/press" element={<Index />} />
          <Route path="/documentation" element={<Index />} />
          <Route path="/help" element={<Index />} />
          <Route path="/guides" element={<Index />} />
          <Route path="/status" element={<Index />} />
          <Route path="/privacy" element={<Index />} />
          <Route path="/terms" element={<Index />} />
          <Route path="/cookies" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
