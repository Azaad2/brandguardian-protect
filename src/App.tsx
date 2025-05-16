
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "./hooks/use-analytics";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/use-auth";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResellerHub from "./pages/ResellerHub";
import BrandPortal from "./pages/brand/BrandPortal";
import ResellerPortal from "./pages/reseller/ResellerPortal";
import BrandLogin from "./pages/brand/BrandLogin";
import ResellerLogin from "./pages/reseller/ResellerLogin";
import BrandDashboard from "./pages/brand/BrandDashboard";
import ResellerDashboard from "./pages/reseller/ResellerDashboard";
import BrandSignup from "./pages/brand/BrandSignup";
import ResellerSignup from "./pages/reseller/ResellerSignup";
import PasswordReset from "./pages/auth/PasswordReset";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

// Analytics wrapper component to apply analytics to all routes
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AnalyticsWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/reseller-hub" element={<ResellerHub />} />
                
                {/* Brand Portal Routes */}
                <Route path="/brand" element={<BrandPortal />} />
                <Route path="/brand/login" element={<BrandLogin />} />
                <Route path="/brand/signup" element={<BrandSignup />} />
                <Route path="/brand/dashboard/*" element={
                  <AuthGuard requiredRole="brand" redirectTo="/brand/login">
                    <BrandDashboard />
                  </AuthGuard>
                } />
                
                {/* Reseller Portal Routes */}
                <Route path="/reseller" element={<ResellerPortal />} />
                <Route path="/reseller/login" element={<ResellerLogin />} />
                <Route path="/reseller/signup" element={<ResellerSignup />} />
                <Route path="/reseller/dashboard/*" element={
                  <AuthGuard requiredRole="reseller" redirectTo="/reseller/login">
                    <ResellerDashboard />
                  </AuthGuard>
                } />
                
                {/* Shared Auth Routes */}
                <Route path="/reset-password" element={<PasswordReset />} />
                
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
            </AnalyticsWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
