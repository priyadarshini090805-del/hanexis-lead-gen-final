'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  Sparkles,
  MessageSquareText,
  Plug,
  Settings,
  Shield,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navigation = [
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
    <aside
      className="
        sticky top-0 hidden
        h-screen w-[270px]
        shrink-0
        border-r border-neutral-200
        bg-[#fafafa]
        lg:flex
      "
    >
      <div className="flex h-full w-full flex-col">

        {/* Logo */}

        <div className="px-6 pt-7 pb-6">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl
                border border-neutral-200
                bg-white
                shadow-sm
              "
            >
              <Sparkles className="h-5 w-5 text-neutral-700" />
            </div>

            <div>
              <div
                className="
                  text-[17px]
                  font-semibold
                  tracking-tight
                  text-neutral-900
                "
              >
                Hanexis
              </div>

              <div
                className="
                  text-xs
                  text-neutral-500
                "
              >
                Sales Workspace
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4">

          <div
            className="
              mb-3 px-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-neutral-400
            "
          >
            Workspace
          </div>

          <div className="space-y-1.5">

            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (
                  item.href !== '/dashboard' &&
                  pathname.startsWith(item.href)
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `
                      group flex items-center
                      gap-3 rounded-2xl
                      px-4 py-3
                      transition-all duration-200
                    `,

                    active
                      ? `
                        bg-neutral-900
                        text-white
                        shadow-lg
                      `
                      : `
                        text-neutral-700
                        hover:bg-white
                        hover:shadow-sm
                      `
                  )}
                >
                  <div
                    className={cn(
                      `
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        transition
                      `,

                      active
                        ? `
                          bg-white/10
                        `
                        : `
                          bg-neutral-100
                          group-hover:bg-neutral-200
                        `
                    )}
                  >
                    <item.icon
                      className={cn(
                        `
                          h-4.5 w-4.5
                        `,

                        active
                          ? `
                            text-white
                          `
                          : `
                            text-neutral-700
                          `
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      `
                        text-sm font-medium
                      `,

                      active
                        ? `
                          text-white
                        `
                        : `
                          text-neutral-800
                        `
                    )}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Admin */}

          {role === 'ADMIN' && (
            <div className="mt-8">

              <div
                className="
                  rounded-2xl border
                  border-amber-200
                  bg-amber-50
                  p-4
                "
              >
                <div className="flex gap-3">

                  <div
                    className="
                      flex h-10 w-10
                      shrink-0 items-center
                      justify-center
                      rounded-xl
                      bg-amber-100
                    "
                  >
                    <Shield
                      className="
                        h-5 w-5
                        text-amber-700
                      "
                    />
                  </div>

                  <div>

                    <div
                      className="
                        text-sm font-medium
                        text-amber-900
                      "
                    >
                      Admin Access
                    </div>

                    <p
                      className="
                        mt-1 text-xs
                        leading-5
                        text-amber-700
                      "
                    >
                      Workspace management permissions enabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}

        <div
          className="
            border-t border-neutral-200
            px-6 py-5
          "
        >
          <div
            className="
              flex items-center
              justify-between
            "
          >
            <div>

              <div
                className="
                  text-xs
                  text-neutral-500
                "
              >
                Environment
              </div>

              <div
                className="
                  mt-1 text-sm
                  font-medium
                  text-neutral-900
                "
              >
                Production
              </div>
            </div>

            <div
              className="
                flex items-center
                gap-2 rounded-full
                bg-white
                px-3 py-1.5
                text-xs
                text-neutral-600
                shadow-sm
              "
            >
              <div
                className="
                  h-2 w-2 rounded-full
                  bg-emerald-500
                "
              />

              Live
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}