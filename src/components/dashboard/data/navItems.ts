
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  AlertTriangle,
  FileText,
  Truck,
  UserPlus,
  Shield,
  CheckSquare
} from 'lucide-react';
import { NavItem } from '../types';

export const brandNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    href: '/brand/dashboard',
  },
  {
    icon: Users,
    title: 'Resellers',
    href: '/brand/dashboard/resellers',
  },
  {
    icon: Package,
    title: 'Inventory',
    href: '/brand/dashboard/inventory',
  },
  {
    icon: ShoppingCart,
    title: 'Orders',
    href: '/brand/dashboard/orders',
  },
  {
    icon: FileText,
    title: 'Listings',
    href: '/brand/dashboard/listings',
  },
  {
    icon: Shield,
    title: 'Compliance',
    href: '/brand/dashboard/compliance',
  },
  {
    icon: AlertTriangle,
    title: 'Alerts',
    href: '/brand/dashboard/alerts',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    href: '/brand/dashboard/analytics',
  },
  {
    icon: FileText,
    title: 'Reports',
    href: '/brand/dashboard/reports',
  },
  {
    icon: MessageSquare,
    title: 'Messages',
    href: '/brand/dashboard/messages',
  },
  {
    icon: Settings,
    title: 'Settings',
    href: '/brand/dashboard/settings',
  },
];

export const resellerNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    href: '/reseller/dashboard',
  },
  {
    icon: ShoppingCart,
    title: 'Orders',
    href: '/reseller/dashboard/orders',
  },
  {
    icon: Users,
    title: 'Brands',
    href: '/reseller/dashboard/brands',
  },
  {
    icon: Package,
    title: 'Catalogs',
    href: '/reseller/dashboard/catalogs',
  },
  {
    icon: Truck,
    title: 'Shipments',
    href: '/reseller/dashboard/shipments',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    href: '/reseller/dashboard/analytics',
  },
  {
    icon: MessageSquare,
    title: 'Messages',
    href: '/reseller/dashboard/messages',
  },
  {
    icon: Settings,
    title: 'Settings',
    href: '/reseller/dashboard/settings',
  },
];

export const adminNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    icon: Users,
    title: 'Users',
    href: '/admin/dashboard/users',
  },
  {
    icon: UserPlus,
    title: 'Reseller Registration',
    href: '/admin/dashboard/reseller-registration',
  },
  {
    icon: CheckSquare,
    title: 'Catalog Management',
    href: '/admin/dashboard/catalog-management',
  },
];
