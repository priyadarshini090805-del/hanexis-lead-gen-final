'use client';

import { useMemo, useState } from 'react';

import { signOut } from 'next-auth/react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  Search,
  Command,
  Activity,
} from 'lucide-react';

import { initials } from '@/lib/utils';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export function Topbar({
  name,
  email,
  image,
  role,
}: {
  name: string;

  email: string;

  image: string | null;

  role: 'ADMIN' | 'USER';
}) {
  const [open, setOpen] =
    useState(false);

  const greeting =
    useMemo(
      () => getGreeting(),
      []
    );

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-neutral-200
        bg-white/85
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex h-[74px]
          items-center justify-between
          gap-6 px-5
          sm:px-8
        "
      >

        {/* Left Section */}

        <div
          className="
            flex min-w-0
            items-center gap-6
          "
        >

          {/* Workspace Heading */}

          <div className="min-w-0">

            <div
              className="
                flex items-center gap-2
              "
            >
              <div
                className="
                  flex h-7 w-7
                  items-center justify-center
                  rounded-lg
                  bg-neutral-100
                "
              >
                <Sparkles
                  className="
                    h-3.5 w-3.5
                    text-neutral-700
                  "
                />
              </div>

              <span
                className="
                  text-xs font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-500
                "
              >
                AI Workspace
              </span>
            </div>

            <h1
              className="
                mt-1 truncate
                text-lg font-semibold
                tracking-tight
                text-neutral-900
              "
            >
              {greeting},{' '}
              {name.split(' ')[0]}
            </h1>
          </div>

          {/* Search */}

          <div
            className="
              hidden lg:flex
              items-center
            "
          >
            <button
              className="
                flex h-11 w-[320px]
                items-center justify-between
                rounded-2xl border
                border-neutral-200
                bg-neutral-50/80
                px-4 transition
                hover:bg-white
              "
            >
              <div
                className="
                  flex items-center gap-3
                "
              >
                <Search
                  className="
                    h-4 w-4
                    text-neutral-400
                  "
                />

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Search leads, outreach,
                  templates...
                </span>
              </div>

              <div
                className="
                  flex items-center gap-1
                  rounded-lg border
                  border-neutral-200
                  bg-white px-2 py-1
                  text-xs text-neutral-500
                "
              >
                <Command className="h-3 w-3" />
                K
              </div>
            </button>
          </div>
        </div>

        {/* Right Section */}

        <div
          className="
            flex items-center gap-3
          "
        >

          {/* AI Status */}

          <div
            className="
              hidden xl:flex
              items-center gap-3
              rounded-2xl border
              border-neutral-200
              bg-neutral-50
              px-4 py-2.5
            "
          >
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
                  text-emerald-700
                "
              />
            </div>

            <div>

              <div
                className="
                  text-xs
                  text-neutral-500
                "
              >
                AI Processing
              </div>

              <div
                className="
                  text-sm font-medium
                  text-neutral-900
                "
              >
                Systems Healthy
              </div>
            </div>
          </div>

          {/* Notifications */}

          <button
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-2xl border
              border-neutral-200
              bg-white transition
              hover:bg-neutral-50
            "
          >
            <Bell
              className="
                h-4 w-4
                text-neutral-700
              "
            />

            <div
              className="
                absolute right-3 top-3
                h-2 w-2
                rounded-full
                bg-rose-500
              "
            />
          </button>

          {/* Profile */}

          <div className="relative">

            <button
              onClick={() =>
                setOpen(
                  (value) =>
                    !value
                )
              }
              className="
                flex items-center
                gap-3 rounded-2xl
                border border-neutral-200
                bg-white px-3 py-2
                transition
                hover:bg-neutral-50
              "
            >
              {/* Avatar */}

              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name}
                  className="
                    h-10 w-10
                    rounded-xl
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-neutral-900
                    text-sm font-semibold
                    text-white
                  "
                >
                  {initials(name)}
                </div>
              )}

              {/* Identity */}

              <div
                className="
                  hidden text-left
                  sm:block
                "
              >
                <div
                  className="
                    text-sm font-medium
                    text-neutral-900
                  "
                >
                  {name}
                </div>

                <div
                  className="
                    text-xs
                    text-neutral-500
                  "
                >
                  {role === 'ADMIN'
                    ? 'Administrator'
                    : 'Workspace Member'}
                </div>
              </div>

              <ChevronDown
                className="
                  hidden h-4 w-4
                  text-neutral-400
                  sm:block
                "
              />
            </button>

            <AnimatePresence>

              {open && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="
                    absolute right-0 mt-3
                    w-[320px]
                    overflow-hidden
                    rounded-3xl border
                    border-neutral-200
                    bg-white
                    shadow-2xl
                  "
                >

                  {/* Header */}

                  <div
                    className="
                      border-b
                      border-neutral-200
                      px-5 py-5
                    "
                  >
                    <div
                      className="
                        flex items-start
                        gap-4
                      "
                    >

                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={name}
                          className="
                            h-14 w-14
                            rounded-2xl
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex h-14 w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-neutral-900
                            text-lg font-semibold
                            text-white
                          "
                        >
                          {initials(name)}
                        </div>
                      )}

                      <div className="min-w-0">

                        <div
                          className="
                            truncate text-base
                            font-semibold
                            text-neutral-900
                          "
                        >
                          {name}
                        </div>

                        <div
                          className="
                            mt-1 truncate
                            text-sm
                            text-neutral-500
                          "
                        >
                          {email}
                        </div>

                        <div
                          className="
                            mt-3 inline-flex
                            items-center gap-2
                            rounded-full
                            border border-neutral-200
                            bg-neutral-50
                            px-3 py-1.5
                            text-xs font-medium
                            text-neutral-700
                          "
                        >
                          <Shield className="h-3 w-3" />

                          {role === 'ADMIN'
                            ? 'Admin Access'
                            : 'Standard Access'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workspace Stats */}

                  <div
                    className="
                      grid grid-cols-2
                      gap-3 border-b
                      border-neutral-200
                      p-5
                    "
                  >
                    <div
                      className="
                        rounded-2xl
                        bg-neutral-50
                        p-4
                      "
                    >
                      <div
                        className="
                          text-xs
                          text-neutral-500
                        "
                      >
                        Workspace
                      </div>

                      <div
                        className="
                          mt-1 text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        Hanexis AI
                      </div>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        bg-neutral-50
                        p-4
                      "
                    >
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
                          text-emerald-700
                        "
                      >
                        Stable
                      </div>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="p-3">

                    <button
                      onClick={() =>
                        signOut({
                          callbackUrl:
                            '/',
                        })
                      }
                      className="
                        flex w-full
                        items-center gap-3
                        rounded-2xl
                        px-4 py-3
                        text-left text-sm
                        text-neutral-700
                        transition
                        hover:bg-neutral-100
                      "
                    >
                      <LogOut
                        className="
                          h-4 w-4
                        "
                      />

                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}