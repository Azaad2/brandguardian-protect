
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Bell, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  ShoppingBag,
  FileBarChart,
} from 'lucide-react';
import { NavItem } from '../types';

export const BrandNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/brand/dashboard' },
  { icon: Users, label: 'Resellers', path: '/brand/dashboard/resellers', badge: '3' },
  { icon: Package, label: 'Inventory', path: '/brand/dashboard/inventory' },
  { icon: ShoppingBag, label: 'Listings', path: '/brand/dashboard/listings' },
  { icon: ShoppingCart, label: 'Orders', path: '/brand/dashboard/orders' },
  { icon: ShieldCheck, label: 'Compliance', path: '/brand/dashboard/compliance', badge: '2' },
  { icon: Bell, label: 'Alerts', path: '/brand/dashboard/alerts' },
  { icon: MessageSquare, label: 'Messages', path: '/brand/dashboard/messages', badge: '5' },
  { icon: BarChart3, label: 'Analytics', path: '/brand/dashboard/analytics' },
  { icon: FileBarChart, label: 'Reports', path: '/brand/dashboard/reports' },
  { icon: Settings, label: 'Settings', path: '/brand/dashboard/settings' },
];

export const ResellerNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/reseller/dashboard' },
  { icon: Package, label: 'Brands', path: '/reseller/dashboard/brands' },
  { icon: ShoppingCart, label: 'Orders', path: '/reseller/dashboard/orders' },
  { icon: Bell, label: 'Shipments', path: '/reseller/dashboard/shipments' },
  { icon: MessageSquare, label: 'Messages', path: '/reseller/dashboard/messages', badge: '3' },
  { icon: BarChart3, label: 'Analytics', path: '/reseller/dashboard/analytics' },
  { icon: Settings, label: 'Settings', path: '/reseller/dashboard/settings' },
];
