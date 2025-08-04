import { lazy } from 'react';

// Lazy load heavy components to improve initial bundle size
export const LazyBlog = lazy(() => import('@/pages/Blog'));
export const LazyAbout = lazy(() => import('@/pages/About'));
export const LazyResellerHub = lazy(() => import('@/pages/ResellerHub'));
export const LazyResellerDashboard = lazy(() => import('@/pages/reseller/ResellerDashboard'));
export const LazyBrandDashboard = lazy(() => import('@/pages/brand/BrandDashboard'));
export const LazyAdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
export const LazyUserManagement = lazy(() => import('@/pages/admin/UserManagement'));

// Lazy load blog posts
export const LazyAmazonBrandRegistryBenefits = lazy(() => import('@/pages/blog/AmazonBrandRegistryBenefits'));
export const LazyAmazonWholesaleVsPrivateLabel = lazy(() => import('@/pages/blog/AmazonWholesaleVsPrivateLabel'));
export const LazyEnforceMAPPolicyPreventUnauthorizedSellers = lazy(() => import('@/pages/blog/EnforceMAPPolicyPreventUnauthorizedSellers'));
export const LazyHowToGetUngatedAnyBrandAmazon2025 = lazy(() => import('@/pages/blog/HowToGetUngatedAnyBrandAmazon2025'));
export const LazyIdentifyRemoveCounterfeitProducts = lazy(() => import('@/pages/blog/IdentifyRemoveCounterfeitProducts'));
export const LazyMasterAmazonResellerBusiness = lazy(() => import('@/pages/blog/MasterAmazonResellerBusiness'));
export const LazyPreventUnauthorizedSellersAmazon = lazy(() => import('@/pages/blog/PreventUnauthorizedSellersAmazon'));
export const LazyUnlockAmazonWholesaleSuccess = lazy(() => import('@/pages/blog/UnlockAmazonWholesaleSuccess'));
export const LazyOutreachThousandBrandsAmazonWholesale = lazy(() => import('@/pages/blog/OutreachThousandBrandsAmazonWholesale'));