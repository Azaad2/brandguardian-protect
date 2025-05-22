
import { ReactNode } from 'react';
import { UserRole } from '@/types/auth';

export interface NavItem {
  icon: React.ElementType;
  title: string; // Changed from label to match existing code
  href: string;  // Changed from path to match existing code
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
