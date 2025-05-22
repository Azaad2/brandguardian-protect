
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  MessageSquare,
  Package,
  Settings,
  BarChart3,
  Users,
  FileText,
  ClipboardCheck,
  Bell,
} from "lucide-react";

export const brandNavItems = [
  {
    title: "Dashboard",
    href: "/brand/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/brand/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/brand/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Listings",
    href: "/brand/dashboard/listings",
    icon: Store,
  },
  {
    title: "Resellers",
    href: "/brand/dashboard/resellers",
    icon: Users,
  },
  {
    title: "Compliance",
    href: "/brand/dashboard/compliance",
    icon: ClipboardCheck,
  },
  {
    title: "Messages",
    href: "/brand/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/brand/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/brand/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Alerts",
    href: "/brand/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/brand/dashboard/settings",
    icon: Settings,
  },
];

export const resellerNavItems = [
  {
    title: "Dashboard",
    href: "/reseller/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/reseller/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Brands",
    href: "/reseller/dashboard/brands",
    icon: Store,
  },
  {
    title: "Catalogs",
    href: "/reseller/dashboard/catalogs",
    icon: FileText,
  },
  {
    title: "Shipments",
    href: "/reseller/dashboard/shipments",
    icon: Package,
  },
  {
    title: "Messages",
    href: "/reseller/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/reseller/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/reseller/dashboard/settings",
    icon: Settings,
  },
];

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reseller Applications",
    href: "/admin/dashboard/reseller-registration",
    icon: ClipboardCheck,
  },
  {
    title: "Catalog Management",
    href: "/admin/dashboard/catalog-management",
    icon: FileText,
  },
  {
    title: "User Management",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "System Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];
