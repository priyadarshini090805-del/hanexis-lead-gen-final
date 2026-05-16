'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';

import {
  LayoutDashboard,
  Users,
  Sparkles,
  MessageSquareText,
  Plug,
  Settings,
  Shield,
  ChevronRight,
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
  const pathname =
    usePathname();

  return (
    <aside
      className="
        sticky top-0 hidden
        h-screen w-[290px]
        shrink-0 overflow-hidden
        border-r border-white/40
        bg-white/70
        backdrop-blur-2xl
        lg:flex
      "
    >

      {/* Ambient */}

      <div
        className="
          pointer-events-none
          absolute inset-0
        "
      >

        <div
          className="
            absolute left-[-80px]
            top-[-80px]
            h-72 w-72
            rounded-full
            bg-violet-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute bottom-[-120px]
            right-[-120px]
            h-80 w-80
            rounded-full
            bg-cyan-200/20
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative z-10
          flex h-full
          w-full flex-col
        "
      >

        {/* Logo */}

        <div
          className="
            px-7 pt-8 pb-7
          "
        >

          <motion.div
            whileHover={{
              y: -2,
            }}
            transition={{
              duration: 0.2,
            }}
          >

            <Link
              href="/dashboard"
              className="
                flex items-center
                gap-4
              "
            >

              <div
                className="
                  relative flex
                  h-12 w-12
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border border-white/50
                  bg-neutral-950
                  shadow-xl
                "
              >

                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-br
                    from-violet-500/20
                    to-cyan-400/20
                  "
                />

                <Sparkles
                  className="
                    relative z-10
                    h-5 w-5
                    text-white
                  "
                />
              </div>

              <div>

                <div
                  className="
                    text-[18px]
                    font-semibold
                    tracking-tight
                    text-neutral-950
                  "
                >
                  Hanexis
                </div>

                <div
                  className="
                    mt-0.5 text-xs
                    tracking-wide
                    text-neutral-500
                  "
                >
                  Intelligent Sales Workspace
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1 px-5
          "
        >

          <div
            className="
              mb-4 px-3
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-neutral-400
            "
          >
            Workspace
          </div>

          <div className="space-y-2">

            {navigation.map(
              (item) => {
                const active =
                  pathname ===
                    item.href ||
                  (
                    item.href !==
                      '/dashboard' &&
                    pathname.startsWith(
                      item.href
                    )
                  );

                return (
                  <motion.div
                    key={
                      item.href
                    }
                    whileHover={{
                      x: 4,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >

                    <Link
                      href={
                        item.href
                      }
                      className={cn(
                        `
                          relative flex
                          items-center
                          gap-4 overflow-hidden
                          rounded-2xl
                          px-4 py-3.5
                          transition-all
                          duration-300
                        `,

                        active
                          ? `
                            bg-neutral-950
                            text-white
                            shadow-[0_10px_40px_rgba(15,23,42,0.18)]
                          `
                          : `
                            text-neutral-700
                            hover:bg-white/80
                            hover:shadow-lg
                          `
                      )}
                    >

                      {/* Active Glow */}

                      {active && (
                        <motion.div
                          layoutId="active-pill"
                          className="
                            absolute inset-0
                            bg-gradient-to-r
                            from-violet-500/10
                            to-cyan-400/10
                          "
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 24,
                          }}
                        />
                      )}

                      {/* Icon */}

                      <div
                        className={cn(
                          `
                            relative z-10
                            flex h-11 w-11
                            items-center
                            justify-center
                            rounded-2xl
                            transition-all
                            duration-300
                          `,

                          active
                            ? `
                              bg-white/10
                              shadow-inner
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
                              h-5 w-5
                              transition-transform
                              duration-300
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

                      {/* Label */}

                      <div
                        className="
                          relative z-10
                          flex flex-1
                          items-center
                          justify-between
                        "
                      >

                        <span
                          className={cn(
                            `
                              text-sm
                              font-medium
                              tracking-tight
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
                        </span>

                        <ChevronRight
                          className={cn(
                            `
                              h-4 w-4
                              transition-all
                              duration-300
                            `,

                            active
                              ? `
                                translate-x-0
                                opacity-100
                                text-white
                              `
                              : `
                                -translate-x-1
                                opacity-0
                                text-neutral-400
                                group-hover:translate-x-0
                                group-hover:opacity-100
                              `
                          )}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* Admin */}

          {role ===
            'ADMIN' && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mt-10"
            >

              <div
                className="
                  relative overflow-hidden
                  rounded-3xl
                  border border-amber-200/60
                  bg-gradient-to-br
                  from-amber-50
                  to-orange-50
                  p-5
                  shadow-sm
                "
              >

                <div
                  className="
                    absolute right-0
                    top-0 h-24
                    w-24 rounded-full
                    bg-amber-200/30
                    blur-2xl
                  "
                />

                <div
                  className="
                    relative z-10
                    flex gap-4
                  "
                >

                  <div
                    className="
                      flex h-12
                      w-12 shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/70
                      shadow-sm
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
                        text-sm
                        font-semibold
                        text-amber-950
                      "
                    >
                      Admin Workspace
                    </div>

                    <p
                      className="
                        mt-1 text-xs
                        leading-5
                        text-amber-800
                      "
                    >
                      Advanced organization
                      controls and system
                      access enabled.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Footer */}

        <div
          className="
            border-t border-white/40
            px-6 py-5
          "
        >

          <div
            className="
              flex items-center
              justify-between
              rounded-2xl
              border border-white/40
              bg-white/50
              px-4 py-3
              backdrop-blur-xl
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
                  text-neutral-950
                "
              >
                Production
              </div>
            </div>

            <div
              className="
                flex items-center
                gap-2 rounded-full
                bg-emerald-50
                px-3 py-1.5
                text-xs font-medium
                text-emerald-700
              "
            >

              <div
                className="
                  h-2 w-2
                  animate-pulse
                  rounded-full
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