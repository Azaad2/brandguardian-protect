
import { ReactNode } from 'react';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}
