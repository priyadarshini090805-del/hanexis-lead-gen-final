'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  Plug,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const links = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/leads',
    label: 'Leads',
    icon: Users,
  },
  {
    href: '/dashboard/ai-messages',
    label: 'Outreach',
    icon: Sparkles,
  },
  {
    href: '/dashboard/prompts',
    label: 'Templates',
    icon: MessageSquareText,
  },
  {
    href: '/dashboard/integrations',
    label: 'Integrations',
    icon: Plug,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function Sidebar({
  role,
}: {
  role: 'ADMIN' | 'USER';
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">

        {/* Header */}

        <div className="border-b border-gray-200 px-6 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-gray-100">
              <Sparkles className="h-4 w-4 text-gray-700" />
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-900">
                Hanexis
              </div>

              <div className="text-xs text-gray-500">
                Lead Operations
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <nav className="flex-1 px-3 py-4">

          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Workspace
          </div>

          <div className="space-y-1">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== '/dashboard' &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  )}
                >
                  <link.icon className="h-4 w-4 shrink-0" />

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}

          {role === 'ADMIN' && (
            <div className="mt-8 border-t border-gray-200 pt-5">

              <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Administration
              </div>

              <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                <Shield className="mt-0.5 h-4 w-4 text-gray-500" />

                <div>
                  <div className="text-sm font-medium text-gray-800">
                    Admin Access
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Full organization-level access enabled.
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="text-xs text-gray-500">
            Workspace Status
          </div>

          <div className="mt-1 text-sm font-medium text-gray-800">
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}