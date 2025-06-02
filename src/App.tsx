

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAnalytics } from "./hooks/use-analytics";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/use-auth";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import RoleUpdater from "./pages/RoleUpdater";
import EnforceMAPPolicyPreventUnauthorizedSellers from "./pages/blog/EnforceMAPPolicyPreventUnauthorizedSellers";
import PreventUnauthorizedSellersAmazon from "./pages/blog/PreventUnauthorizedSellersAmazon";
import AmazonBrandRegistryBenefits from "./pages/blog/AmazonBrandRegistryBenefits";
import IdentifyRemoveCounterfeitProducts from "./pages/blog/IdentifyRemoveCounterfeitProducts";

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
                <Route path="/blog/enforce-map-policy-prevent-unauthorized-sellers-amazon" element={<EnforceMAPPolicyPreventUnauthorizedSellers />} />
                <Route path="/blog/prevent-unauthorized-sellers-amazon" element={<PreventUnauthorizedSellersAmazon />} />
                <Route path="/blog/amazon-brand-registry-benefits" element={<AmazonBrandRegistryBenefits />} />
                <Route path="/blog/identify-remove-counterfeit-products" element={<IdentifyRemoveCounterfeitProducts />} />
                
                {/* Temporary role updater page */}
                <Route path="/update-role" element={<RoleUpdater />} />
                
                {/* Admin Routes - Fixed structure */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/*" element={
                  <AuthGuard requiredRole="admin" redirectTo="/">
                    <DashboardLayout />
                  </AuthGuard>
                }>
                  <Route path="dashboard/*" element={<AdminDashboard />} />
                </Route>
                
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
                
                {/* Catch-all route for 404 */}
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

