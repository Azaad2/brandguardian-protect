
import { ReactNode } from 'react';
import { UserRole } from '@/types';

export interface NavItem {
  icon: React.ElementType;
  title: string;
  href: string;
  badge?: string;
}

export interface TopBarProps {
  toggleSidebar: () => void;
  userRole: UserRole;
  pendingApplicationsCount?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  userRole: UserRole;
}
