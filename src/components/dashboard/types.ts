
import { ReactNode } from 'react';
import { UserRole } from '@/types/auth';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
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
