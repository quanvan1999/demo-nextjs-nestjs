'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AccountDropdown } from './account';
import { Session } from 'next-auth';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Users', href: '/dashboard/users' },
  { name: 'Products', href: '/dashboard/products' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Settings', href: '/dashboard/settings' },
];

interface SidebarProps {
  session: Session;
}

export const Sidebar = ({ session }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <ThemeToggle />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground',
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <AccountDropdown session={session} />
      </div>
    </aside>
  );
};
