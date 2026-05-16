'use client';

import {
  SessionProvider,
} from 'next-auth/react';

import {
  LazyMotion,
  domAnimation,
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Toaster,
} from 'react-hot-toast';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>

      {/* Global Motion Runtime */}

      <LazyMotion
        features={domAnimation}
      >

        <AnimatePresence
          mode="wait"
        >

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
              duration: 0.35,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              min-h-screen
            "
          >

            {children}
          </motion.div>
        </AnimatePresence>
      </LazyMotion>

      {/* Toast System */}

      <Toaster
        position="top-right"
        gutter={14}
        containerStyle={{
          top: 24,
          right: 24,
        }}
        toastOptions={{
          duration: 3500,

          style: {
            background:
              'rgba(255,255,255,0.78)',

            color:
              '#171717',

            border:
              '1px solid rgba(255,255,255,0.55)',

            borderRadius:
              '22px',

            padding:
              '16px 18px',

            backdropFilter:
              'blur(18px)',

            WebkitBackdropFilter:
              'blur(18px)',

            boxShadow:
              '0 12px 40px rgba(15,23,42,0.08)',

            fontSize:
              '14px',

            fontWeight:
              500,
          },

          success: {
            iconTheme: {
              primary:
                '#111827',

              secondary:
                '#ffffff',
            },
          },

          error: {
            iconTheme: {
              primary:
                '#111827',

              secondary:
                '#ffffff',
            },
          },
        }}
      />
    </SessionProvider>
  );
}