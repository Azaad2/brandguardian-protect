
import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "Brands", href: "/dashboard/brands", icon: "Store" },
  { name: "Messages", href: "/dashboard/messages", icon: "MessageCircle" },
  { name: "Orders", href: "/dashboard/orders", icon: "ShoppingCart" },
  { name: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const resellerNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "Brands", href: "/dashboard/brands", icon: "Store" },
  { name: "Messages", href: "/dashboard/messages", icon: "MessageCircle" },
  { name: "Orders", href: "/dashboard/orders", icon: "ShoppingCart" },
  { name: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const brandNavItems: NavItem[] = [
  { name: "Dashboard", href: "/brand/dashboard", icon: "LayoutDashboard" },
  { name: "Inventory", href: "/brand/dashboard/inventory", icon: "Package" },
  { name: "Resellers", href: "/brand/dashboard/resellers", icon: "Users" },
  { name: "Orders", href: "/brand/dashboard/orders", icon: "ShoppingCart" },
  { name: "Messages", href: "/brand/dashboard/messages", icon: "MessageCircle" },
  { name: "Analytics", href: "/brand/dashboard/analytics", icon: "BarChart3" },
  { name: "Settings", href: "/brand/dashboard/settings", icon: "Settings" },
];

export const adminNavItems: NavItem[] = [
  { name: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { name: "Reseller Applications", href: "/admin/dashboard/reseller-applications", icon: "Users" },
  { name: "Brands Directory", href: "/admin/dashboard/brands-directory", icon: "Building2" },
  { name: "Catalog Approvals", href: "/admin/dashboard/catalog-approvals", icon: "PackageCheck" },
  { name: "User Management", href: "/admin/dashboard/user-management", icon: "UserCog" },
];

export const profileActions: NavItem[] = [
  { name: "Profile", href: "/dashboard/settings/profile", icon: "User" },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: "Bell" },
  { name: "Security", href: "/dashboard/settings/security", icon: "Shield" },
];
