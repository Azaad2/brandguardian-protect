
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
  title?: string; // Add optional title for compatibility
}

export type UserRole = 'admin' | 'brand' | 'reseller';
