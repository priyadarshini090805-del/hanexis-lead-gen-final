'use client';

import { useMemo, useState } from 'react';

import { signOut } from 'next-auth/react';

import { AnimatePresence, motion } from 'framer-motion';

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Command,
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
        bg-white/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex h-[76px]
          items-center justify-between
          gap-6 px-6
          lg:px-10
        "
      >

        {/* Left */}

        <div
          className="
            flex min-w-0
            items-center gap-8
          "
        >

          {/* Greeting */}

          <div className="min-w-0">

            <div
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.16em]
                text-neutral-400
              "
            >
              Workspace
            </div>

            <h1
              className="
                mt-1 truncate
                text-[26px]
                font-semibold
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
              hidden xl:flex
              items-center
            "
          >
            <button
              className="
                flex h-12 w-[360px]
                items-center justify-between
                rounded-2xl border
                border-neutral-200
                bg-neutral-50
                px-4 transition-all
                hover:bg-white
                hover:shadow-sm
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
                  Search leads, templates...
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

        {/* Right */}

        <div
          className="
            flex items-center gap-3
          "
        >

          {/* Notification */}

          <button
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-2xl border
              border-neutral-200
              bg-white transition
              hover:bg-neutral-50
              hover:shadow-sm
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
                transition-all
                hover:bg-neutral-50
                hover:shadow-sm
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
                    rounded-2xl
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-2xl
                    bg-neutral-900
                    text-sm font-semibold
                    text-white
                  "
                >
                  {initials(name)}
                </div>
              )}

              {/* Info */}

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
                    w-[300px]
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
                            items-center
                            rounded-full
                            bg-neutral-100
                            px-3 py-1.5
                            text-xs
                            font-medium
                            text-neutral-700
                          "
                        >
                          {role === 'ADMIN'
                            ? 'Admin Access'
                            : 'Standard Access'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}

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