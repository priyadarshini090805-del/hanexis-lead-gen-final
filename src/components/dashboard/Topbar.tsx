'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, ChevronDown, Bell } from 'lucide-react';
import { initials } from '@/lib/utils';

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
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-blush-200/50 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blush-500">
            Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative grid h-9 w-9 place-items-center rounded-full border border-blush-200 bg-white/80 text-blush-600 hover:bg-blush-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-blush-200 bg-white/80 py-1 pl-1 pr-3 hover:bg-blush-50"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-7 w-7 rounded-full" />
              ) : (
                <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-gradient text-xs font-bold text-white">
                  {initials(name)}
                </div>
              )}
              <span className="hidden text-sm font-semibold text-blush-800 sm:inline">{name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-blush-500" />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-blush-200 bg-white/95 shadow-pink-glow backdrop-blur-xl"
                >
                  <div className="border-b border-blush-100 px-4 py-3">
                    <div className="text-sm font-bold text-blush-900">{name}</div>
                    <div className="truncate text-xs text-blush-500">{email}</div>
                    <div className="mt-1 inline-block rounded-full bg-blush-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blush-700">
                      {role}
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-blush-700 hover:bg-blush-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
