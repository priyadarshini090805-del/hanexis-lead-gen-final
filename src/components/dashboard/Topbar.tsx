'use client';

import {
  useMemo,
  useState,
} from 'react';

import { signOut } from 'next-auth/react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Command,
  Sparkles,
} from 'lucide-react';

import { initials } from '@/lib/utils';

function getGreeting() {
  const hour =
    new Date().getHours();

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
        border-b border-white/40
        bg-white/70
        backdrop-blur-2xl
      "
    >

      {/* Ambient Layer */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute left-10
            top-[-120px]
            h-56 w-56
            rounded-full
            bg-violet-200/20
            blur-3xl
          "
        />

        <div
          className="
            absolute right-20
            top-[-100px]
            h-56 w-56
            rounded-full
            bg-cyan-200/20
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative z-10
          flex h-[84px]
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

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="min-w-0"
          >

            <div
              className="
                flex items-center
                gap-2 text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-neutral-400
              "
            >

              <Sparkles
                className="
                  h-3.5 w-3.5
                "
              />

              Workspace
            </div>

            <h1
              className="
                mt-2 truncate
                text-[30px]
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              {greeting},{' '}
              <span
                className="
                  bg-gradient-to-r
                  from-neutral-950
                  to-neutral-500
                  bg-clip-text
                  text-transparent
                "
              >
                {name.split(' ')[0]}
              </span>
            </h1>
          </motion.div>

          {/* Search */}

          <motion.div
            whileHover={{
              y: -1,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              hidden xl:flex
              items-center
            "
          >

            <button
              className="
                group relative
                flex h-14
                w-[390px]
                items-center
                justify-between
                overflow-hidden
                rounded-2xl
                border border-white/50
                bg-white/70
                px-5
                shadow-sm
                backdrop-blur-xl
                transition-all
                duration-300
                hover:shadow-xl
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-r
                  from-violet-500/5
                  to-cyan-400/5
                  opacity-0 transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              <div
                className="
                  relative z-10
                  flex items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-neutral-100
                  "
                >

                  <Search
                    className="
                      h-4 w-4
                      text-neutral-500
                    "
                  />
                </div>

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Search leads,
                  outreach, templates...
                </span>
              </div>

              <div
                className="
                  relative z-10
                  flex items-center
                  gap-1 rounded-xl
                  border border-neutral-200
                  bg-white px-2.5
                  py-1.5 text-xs
                  text-neutral-500
                "
              >

                <Command
                  className="
                    h-3 w-3
                  "
                />

                K
              </div>
            </button>
          </motion.div>
        </div>

        {/* Right */}

        <div
          className="
            flex items-center
            gap-3
          "
        >

          {/* Notifications */}

          <motion.button
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="
              relative flex
              h-12 w-12
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border border-white/50
              bg-white/70
              shadow-sm
              backdrop-blur-xl
            "
          >

            <div
              className="
                absolute inset-0
                bg-gradient-to-br
                from-violet-500/5
                to-cyan-400/5
              "
            />

            <Bell
              className="
                relative z-10
                h-4.5 w-4.5
                text-neutral-700
              "
            />

            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="
                absolute right-3
                top-3 h-2.5
                w-2.5 rounded-full
                bg-rose-500
              "
            />
          </motion.button>

          {/* Profile */}

          <div className="relative">

            <motion.button
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setOpen(
                  (value) =>
                    !value
                )
              }
              className="
                flex items-center
                gap-3 rounded-2xl
                border border-white/50
                bg-white/70 px-3
                py-2 shadow-sm
                backdrop-blur-xl
                transition-all
                duration-300
                hover:shadow-xl
              "
            >

              {/* Avatar */}

              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name}
                  className="
                    h-11 w-11
                    rounded-2xl
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    relative flex
                    h-11 w-11
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    bg-neutral-950
                    text-sm font-semibold
                    text-white
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

                  <span className="relative z-10">
                    {initials(name)}
                  </span>
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
                    text-neutral-950
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
                  {role ===
                  'ADMIN'
                    ? 'Administrator'
                    : 'Workspace Member'}
                </div>
              </div>

              <ChevronDown
                className={`
                  hidden h-4 w-4
                  text-neutral-400
                  transition-transform
                  duration-300
                  sm:block

                  ${
                    open
                      ? `
                        rotate-180
                      `
                      : ''
                  }
                `}
              />
            </motion.button>

            {/* Dropdown */}

            <AnimatePresence>

              {open && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -12,
                    scale: 0.96,
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
                    duration: 0.2,
                  }}
                  className="
                    absolute right-0
                    mt-4 w-[320px]
                    overflow-hidden
                    rounded-[28px]
                    border border-white/50
                    bg-white/80
                    shadow-2xl
                    backdrop-blur-2xl
                  "
                >

                  {/* Glow */}

                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-br
                      from-violet-500/5
                      to-cyan-400/5
                    "
                  />

                  <div className="relative z-10">

                    {/* Header */}

                    <div
                      className="
                        border-b
                        border-neutral-200/70
                        px-6 py-6
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
                              h-16 w-16
                              rounded-3xl
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex h-16 w-16
                              items-center
                              justify-center
                              rounded-3xl
                              bg-neutral-950
                              text-lg
                              font-semibold
                              text-white
                            "
                          >
                            {initials(name)}
                          </div>
                        )}

                        <div className="min-w-0">

                          <div
                            className="
                              truncate
                              text-lg
                              font-semibold
                              text-neutral-950
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
                              mt-4 inline-flex
                              items-center
                              rounded-full
                              border border-white/60
                              bg-white/70
                              px-3 py-1.5
                              text-xs
                              font-medium
                              text-neutral-700
                            "
                          >
                            {role ===
                            'ADMIN'
                              ? 'Admin Access'
                              : 'Standard Access'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="p-3">

                      <motion.button
                        whileHover={{
                          x: 3,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
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
                          transition-all
                          hover:bg-white
                          hover:shadow-sm
                        "
                      >

                        <LogOut
                          className="
                            h-4 w-4
                          "
                        />

                        Sign out
                      </motion.button>
                    </div>
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