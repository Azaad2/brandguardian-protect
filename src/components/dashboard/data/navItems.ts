
import { 
  LayoutDashboard,
  Store,
  MessageCircle,
  ShoppingCart,
  Settings,
  Package,
  Users,
  BarChart3,
  Building2,
  PackageCheck,
  UserCog,
  User,
  Bell,
  Shield
} from "lucide-react";
import { NavItem } from "../types";

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Brands", href: "/dashboard/brands", icon: Store },
  { title: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const resellerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/reseller/dashboard", icon: LayoutDashboard },
  { title: "Brands", href: "/reseller/dashboard/brands", icon: Store },
  { title: "Messages", href: "/reseller/dashboard/messages", icon: MessageCircle },
  { title: "Orders", href: "/reseller/dashboard/orders", icon: ShoppingCart },
  { title: "Settings", href: "/reseller/dashboard/settings", icon: Settings },
];

export const brandNavItems: NavItem[] = [
  { title: "Dashboard", href: "/brand/dashboard", icon: LayoutDashboard },
  { title: "Inventory", href: "/brand/dashboard/inventory", icon: Package },
  { title: "Resellers", href: "/brand/dashboard/resellers", icon: Users },
  { title: "Orders", href: "/brand/dashboard/orders", icon: ShoppingCart },
  { title: "Messages", href: "/brand/dashboard/messages", icon: MessageCircle },
  { title: "Analytics", href: "/brand/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", href: "/brand/dashboard/settings", icon: Settings },
];

export const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Reseller Applications", href: "/admin/dashboard/reseller-applications", icon: Users },
  { title: "Brands Directory", href: "/admin/dashboard/brands-directory", icon: Building2 },
  { title: "Catalog Approvals", href: "/admin/dashboard/catalog-approvals", icon: PackageCheck },
  { title: "User Management", href: "/admin/dashboard/user-management", icon: UserCog },
];

export const profileActions: NavItem[] = [
  { title: "Profile", href: "/dashboard/settings/profile", icon: User },
  { title: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { title: "Security", href: "/dashboard/settings/security", icon: Shield },
];
