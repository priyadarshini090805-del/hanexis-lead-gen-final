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
  ChevronRight,
  Activity,
  BrainCircuit,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navigation = [
  {
    href: '/dashboard',

    label: 'Overview',

    description:
      'Workspace analytics and pipeline insights',

    icon: LayoutDashboard,
  },

  {
    href: '/dashboard/leads',

    label: 'Lead Intelligence',

    description:
      'Manage qualification and engagement workflows',

    icon: Users,
  },

  {
    href: '/dashboard/ai-messages',

    label: 'AI Outreach',

    description:
      'Generate personalized outbound campaigns',

    icon: Sparkles,
  },

  {
    href: '/dashboard/prompts',

    label: 'Prompt Studio',

    description:
      'Reusable AI communication strategies',

    icon: BrainCircuit,
  },

  {
    href: '/dashboard/integrations',

    label: 'Integrations',

    description:
      'Connect external workflow systems',

    icon: Plug,
  },

  {
    href: '/dashboard/settings',

    label: 'Workspace Settings',

    description:
      'Manage account and workspace configuration',

    icon: Settings,
  },
];

export function Sidebar({
  role,
}: {
  role: 'ADMIN' | 'USER';
}) {
  const pathname =
    usePathname();

  return (
    <aside
      className="
        sticky top-0 hidden
        h-screen w-[290px]
        shrink-0
        border-r border-neutral-200
        bg-white/95
        backdrop-blur-xl
        lg:flex
      "
    >
      <div className="flex h-full w-full flex-col">

        {/* Header */}

        <div className="border-b border-neutral-200 px-6 py-6">

          <Link
            href="/dashboard"
            className="
              group flex items-center gap-4
            "
          >
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl
                border border-neutral-200
                bg-neutral-50
                transition
                group-hover:scale-105
              "
            >
              <Sparkles
                className="
                  h-5 w-5
                  text-neutral-700
                "
              />
            </div>

            <div>
              <div
                className="
                  text-base font-semibold
                  tracking-tight
                  text-neutral-900
                "
              >
                Hanexis
              </div>

              <div
                className="
                  mt-0.5 text-xs
                  text-neutral-500
                "
              >
                AI Sales Intelligence Workspace
              </div>
            </div>
          </Link>
        </div>

        {/* Workspace Status */}

        <div className="px-5 pt-5">

          <div
            className="
              rounded-2xl border
              border-neutral-200
              bg-neutral-50/80
              p-4
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
                    text-xs uppercase
                    tracking-wide
                    text-neutral-500
                  "
                >
                  Workspace Health
                </div>

                <div
                  className="
                    mt-1 text-sm
                    font-medium
                    text-neutral-900
                  "
                >
                  Operational
                </div>
              </div>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  bg-emerald-100
                "
              >
                <Activity
                  className="
                    h-4 w-4
                    text-emerald-600
                  "
                />
              </div>
            </div>

            <div
              className="
                mt-4 flex items-center
                gap-2 text-xs
                text-neutral-500
              "
            >
              <div
                className="
                  h-2 w-2 rounded-full
                  bg-emerald-500
                "
              />

              AI systems healthy
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1 overflow-y-auto
            px-4 py-6
          "
        >
          <div
            className="
              mb-3 px-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-neutral-400
            "
          >
            Workspace Navigation
          </div>

          <div className="space-y-1.5">

            {navigation.map(
              (item) => {
                const active =
                  pathname ===
                    item.href ||
                  (item.href !==
                    '/dashboard' &&
                    pathname.startsWith(
                      item.href
                    ));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      `
                        group relative flex
                        items-start gap-4
                        rounded-2xl
                        border px-4 py-4
                        transition-all duration-200
                      `,

                      active
                        ? `
                          border-neutral-900
                          bg-neutral-900
                          text-white
                          shadow-lg
                        `
                        : `
                          border-transparent
                          text-neutral-700
                          hover:border-neutral-200
                          hover:bg-neutral-50
                        `
                    )}
                  >
                    <div
                      className={cn(
                        `
                          mt-0.5 flex
                          h-10 w-10 shrink-0
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
                            group-hover:bg-white
                          `
                      )}
                    >
                      <item.icon
                        className={cn(
                          `
                            h-5 w-5
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

                    <div className="min-w-0 flex-1">

                      <div
                        className={cn(
                          `
                            text-sm
                            font-medium
                          `,

                          active
                            ? `
                              text-white
                            `
                            : `
                              text-neutral-900
                            `
                        )}
                      >
                        {item.label}
                      </div>

                      <div
                        className={cn(
                          `
                            mt-1 text-xs
                            leading-5
                          `,

                          active
                            ? `
                              text-neutral-300
                            `
                            : `
                              text-neutral-500
                            `
                        )}
                      >
                        {
                          item.description
                        }
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        `
                          mt-1 h-4 w-4
                          transition
                        `,

                        active
                          ? `
                            text-white
                          `
                          : `
                            text-neutral-400
                            opacity-0
                            group-hover:opacity-100
                          `
                      )}
                    />
                  </Link>
                );
              }
            )}
          </div>

          {/* Admin Controls */}

          {role === 'ADMIN' && (
            <div className="mt-8">

              <div
                className="
                  mb-3 px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Administrative Access
              </div>

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
                      Admin Workspace
                    </div>

                    <p
                      className="
                        mt-1 text-xs
                        leading-5
                        text-amber-700
                      "
                    >
                      Organization-level controls,
                      analytics visibility,
                      and operational permissions
                      are enabled.
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
                Platform Status
              </div>

              <div
                className="
                  mt-1 text-sm
                  font-medium
                  text-neutral-900
                "
              >
                Stable Environment
              </div>
            </div>

            <div
              className="
                flex items-center
                gap-2 rounded-full
                border border-neutral-200
                px-3 py-1.5
                text-xs
                text-neutral-600
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