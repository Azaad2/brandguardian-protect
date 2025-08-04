import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { usePerformanceMonitoring } from '@/hooks/use-performance';
import { useAnalytics } from '@/hooks/use-analytics';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import ResellerHub from '@/pages/ResellerHub';
import NotFound from '@/pages/NotFound';
import ShippingDelivery from '@/pages/ShippingDelivery';

// Legal pages
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import CancellationRefundPolicy from '@/pages/CancellationRefundPolicy';

// Auth pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminSignup from '@/pages/admin/AdminSignup';
import BrandLogin from '@/pages/brand/BrandLogin';
import BrandSignup from '@/pages/brand/BrandSignup';
import ResellerLogin from '@/pages/reseller/ResellerLogin';
import ResellerSignup from '@/pages/reseller/ResellerSignup';
import PasswordReset from '@/pages/auth/PasswordReset';
import PasswordResetConfirm from '@/pages/auth/PasswordResetConfirm';

// Dashboard pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import BrandDashboard from '@/pages/brand/BrandDashboard';
import ResellerDashboard from '@/pages/reseller/ResellerDashboard';

// Portal pages
import BrandPortal from '@/pages/brand/BrandPortal';
import ResellerPortal from '@/pages/reseller/ResellerPortal';
import UserManagement from '@/pages/admin/UserManagement';
import ResellerRegistration from '@/pages/admin/ResellerRegistration';

// Blog pages
import AmazonWholesaleVsPrivateLabel from '@/pages/blog/AmazonWholesaleVsPrivateLabel';
import HowToGetUngatedAnyBrandAmazon2025 from '@/pages/blog/HowToGetUngatedAnyBrandAmazon2025';
import MasterAmazonResellerBusiness from '@/pages/blog/MasterAmazonResellerBusiness';
import UnlockAmazonWholesaleSuccess from '@/pages/blog/UnlockAmazonWholesaleSuccess';
import EnforceMAPPolicyPreventUnauthorizedSellers from '@/pages/blog/EnforceMAPPolicyPreventUnauthorizedSellers';
import PreventUnauthorizedSellersAmazon from '@/pages/blog/PreventUnauthorizedSellersAmazon';
import IdentifyRemoveCounterfeitProducts from '@/pages/blog/IdentifyRemoveCounterfeitProducts';
import AmazonBrandRegistryBenefits from '@/pages/blog/AmazonBrandRegistryBenefits';

// Admin pages
import Admin from '@/pages/Admin';
import RoleUpdater from '@/pages/RoleUpdater';

// Auth Guard
import AuthGuard from '@/components/auth/AuthGuard';
import { 
  LazyBlog, LazyAbout, LazyResellerHub, 
  LazyResellerDashboard, LazyBrandDashboard, LazyAdminDashboard,
  LazyUserManagement,
  LazyAmazonBrandRegistryBenefits,
  LazyAmazonWholesaleVsPrivateLabel,
  LazyEnforceMAPPolicyPreventUnauthorizedSellers,
  LazyHowToGetUngatedAnyBrandAmazon2025,
  LazyIdentifyRemoveCounterfeitProducts,
  LazyMasterAmazonResellerBusiness,
  LazyPreventUnauthorizedSellersAmazon,
  LazyUnlockAmazonWholesaleSuccess,
  LazyOutreachThousandBrandsAmazonWholesale
} from '@/components/LazyComponents';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  useAnalytics();
  usePerformanceMonitoring();
  
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<LazyAbout />} />
        <Route path="/blog" element={<LazyBlog />} />
        <Route path="/reseller-hub" element={<LazyResellerHub />} />
        <Route path="/shipping-delivery" element={<ShippingDelivery />} />
        
        {/* Legal routes */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
        
        {/* Auth routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/brand/login" element={<BrandLogin />} />
        <Route path="/brand/signup" element={<BrandSignup />} />
        <Route path="/reseller/login" element={<ResellerLogin />} />
        <Route path="/reseller/signup" element={<ResellerSignup />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/reset-password/confirm" element={<PasswordResetConfirm />} />
        
        {/* Blog routes with lazy loading */}
        <Route path="/blog/amazon-wholesale-vs-private-label" element={<LazyAmazonWholesaleVsPrivateLabel />} />
        <Route path="/blog/how-to-get-ungated-any-brand-amazon-2025-ultimate-guide" element={<LazyHowToGetUngatedAnyBrandAmazon2025 />} />
        <Route path="/blog/master-amazon-reseller-business-strategies-profitability-sourcing-growth" element={<LazyMasterAmazonResellerBusiness />} />
        <Route path="/blog/unlock-amazon-wholesale-success-bndbox-brand-approvals" element={<LazyUnlockAmazonWholesaleSuccess />} />
        <Route path="/blog/enforce-map-policy-prevent-unauthorized-sellers" element={<LazyEnforceMAPPolicyPreventUnauthorizedSellers />} />
        <Route path="/blog/prevent-unauthorized-sellers-amazon" element={<LazyPreventUnauthorizedSellersAmazon />} />
        <Route path="/blog/identify-remove-counterfeit-products" element={<LazyIdentifyRemoveCounterfeitProducts />} />
        <Route path="/blog/amazon-brand-registry-benefits" element={<LazyAmazonBrandRegistryBenefits />} />
        <Route path="/blog/outreach-thousand-brands-amazon-wholesale" element={<LazyOutreachThousandBrandsAmazonWholesale />} />
        
        {/* Protected dashboard routes with lazy loading */}
        <Route path="/admin/dashboard" element={
          <AuthGuard requiredRole="admin">
            <LazyAdminDashboard />
          </AuthGuard>
        } />
        <Route path="/admin/dashboard/*" element={
          <AuthGuard requiredRole="admin">
            <LazyAdminDashboard />
          </AuthGuard>
        } />
        <Route path="/brand/dashboard" element={
          <AuthGuard requiredRole="brand">
            <LazyBrandDashboard />
          </AuthGuard>
        } />
        <Route path="/reseller/dashboard" element={
          <AuthGuard requiredRole="reseller">
            <LazyResellerDashboard />
          </AuthGuard>
        } />
        <Route path="/reseller/dashboard/*" element={
          <AuthGuard requiredRole="reseller">
            <LazyResellerDashboard />
          </AuthGuard>
        } />
        
        {/* Protected portal routes */}
        <Route path="/brand/*" element={
          <AuthGuard requiredRole="brand">
            <BrandPortal />
          </AuthGuard>
        } />
        <Route path="/reseller/*" element={
          <AuthGuard requiredRole="reseller">
            <ResellerPortal />
          </AuthGuard>
        } />
        
        {/* Protected admin routes */}
        <Route path="/admin/users" element={
          <AuthGuard requiredRole="admin">
            <LazyUserManagement />
          </AuthGuard>
        } />
        <Route path="/admin/reseller-registration" element={
          <AuthGuard requiredRole="admin">
            <ResellerRegistration />
          </AuthGuard>
        } />
        
        {/* Legacy admin routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/role-updater" element={<RoleUpdater />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
