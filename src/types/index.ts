
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

export type UserRole = 'admin' | 'brand' | 'reseller';
