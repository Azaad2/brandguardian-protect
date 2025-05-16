
import { ReactNode } from 'react';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

export interface TopBarProps {
  toggleSidebar: () => void;
  userRole: string;
  pendingApplicationsCount?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  userRole: string;
}
