import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicAuthProvider } from '@/hooks/use-public-auth';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { usePerformanceMonitoring } from '@/hooks/use-performance';
import { useAnalytics } from '@/hooks/use-analytics';

// Core pages (only import essential landing pages directly)
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import ShippingDelivery from '@/pages/ShippingDelivery';

// Legal pages
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import CancellationRefundPolicy from '@/pages/CancellationRefundPolicy';

// Auth pages (these are small and need to be immediately accessible)
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminSignup from '@/pages/admin/AdminSignup';
import BrandLogin from '@/pages/brand/BrandLogin';
import BrandSignup from '@/pages/brand/BrandSignup';
import ResellerLogin from '@/pages/reseller/ResellerLogin';
import ResellerSignup from '@/pages/reseller/ResellerSignup';
import PasswordReset from '@/pages/auth/PasswordReset';
import PasswordResetConfirm from '@/pages/auth/PasswordResetConfirm';

// Portal pages (small routing components)
import BrandPortal from '@/pages/brand/BrandPortal';
import ResellerPortal from '@/pages/reseller/ResellerPortal';
import ResellerRegistration from '@/pages/admin/ResellerRegistration';

// Legacy admin pages
import Admin from '@/pages/Admin';
import RoleUpdater from '@/pages/RoleUpdater';

// Protected Route Component  
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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

// Redirect outdated /admin-dashboard paths to new /admin/dashboard, preserving subpaths
const AdminDashboardRedirect = () => {
  const location = useLocation();
  const target = location.pathname.replace(/^\/admin-dashboard/, '/admin/dashboard') + (location.search || '') + (location.hash || '');
  return <Navigate to={target} replace />;
};

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
        <Route path="/admin/login" element={<AuthProvider><AdminLogin /></AuthProvider>} />
        <Route path="/admin/signup" element={<AuthProvider><AdminSignup /></AuthProvider>} />
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
          <ProtectedRoute requiredRole="admin">
            <LazyAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard/*" element={
          <ProtectedRoute requiredRole="admin">
            <LazyAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/brand/dashboard" element={
          <ProtectedRoute requiredRole="brand">
            <LazyBrandDashboard />
          </ProtectedRoute>
        } />
        <Route path="/reseller/dashboard" element={
          <ProtectedRoute requiredRole="reseller">
            <LazyResellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/reseller/dashboard/*" element={
          <ProtectedRoute requiredRole="reseller">
            <LazyResellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected portal routes */}
        <Route path="/brand/*" element={
          <ProtectedRoute requiredRole="brand">
            <BrandPortal />
          </ProtectedRoute>
        } />
        <Route path="/reseller/*" element={
          <ProtectedRoute requiredRole="reseller">
            <ResellerPortal />
          </ProtectedRoute>
        } />
        
        {/* Protected admin routes */}
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <LazyUserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reseller-registration" element={
          <ProtectedRoute requiredRole="admin">
            <ResellerRegistration />
          </ProtectedRoute>
        } />
        {/* Redirects for old admin path */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboardRedirect />} />
        
        {/* Legacy admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
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
        <PublicAuthProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </PublicAuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
