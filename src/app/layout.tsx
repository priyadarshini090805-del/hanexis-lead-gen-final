import type { Metadata } from 'next';

import {
  Inter,
  Plus_Jakarta_Sans,
} from 'next/font/google';

import './globals.css';

import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],

  variable:
    '--font-inter',

  display: 'swap',
});

const display =
  Plus_Jakarta_Sans({
    subsets: ['latin'],

    variable:
      '--font-display',

    display: 'swap',
  });

export const metadata: Metadata =
  {
    title:
      'Hanexis — AI Lead Gen',

    description:
      'AI-driven social media lead generation. Personalized outreach for LinkedIn & Instagram at scale.',

    metadataBase:
      new URL(
        process.env
          .NEXTAUTH_URL ??
          'http://localhost:3000'
      ),
  };

export const viewport = {
  themeColor:
    '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${inter.variable}
        ${display.variable}
      `}
    >

      <body
        className="
          min-h-screen
          overflow-x-hidden
          bg-[#f5f7fb]
          font-sans
          antialiased
          text-neutral-900
        "
      >

        {/* Global Ambient Layer */}

        <div
          className="
            pointer-events-none
            fixed inset-0
            overflow-hidden
          "
        >

          {/* Top Glow */}

          <div
            className="
              absolute left-[-180px]
              top-[-180px]
              h-[520px] w-[520px]
              rounded-full
              bg-violet-300/20
              blur-3xl
            "
          />

          {/* Right Glow */}

          <div
            className="
              absolute right-[-220px]
              top-[120px]
              h-[520px] w-[520px]
              rounded-full
              bg-cyan-300/20
              blur-3xl
            "
          />

          {/* Bottom Glow */}

          <div
            className="
              absolute bottom-[-260px]
              left-[30%]
              h-[600px] w-[600px]
              rounded-full
              bg-fuchsia-200/10
              blur-3xl
            "
          />

          {/* Grid Texture */}

          <div
            className="
              absolute inset-0
              opacity-[0.03]
            "
            style={{
              backgroundImage:
                `
                linear-gradient(
                  to right,
                  black 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  black 1px,
                  transparent 1px
                )
              `,

              backgroundSize:
                '48px 48px',
            }}
          />
        </div>

        {/* Noise Texture */}

        <div
          className="
            pointer-events-none
            fixed inset-0
            opacity-[0.015]
            mix-blend-overlay
          "
          style={{
            backgroundImage:
              `
              radial-gradient(
                circle at 1px 1px,
                black 1px,
                transparent 0
              )
            `,

            backgroundSize:
              '24px 24px',
          }}
        />

        {/* App */}

        <div className="relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}