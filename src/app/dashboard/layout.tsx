import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { Sidebar } from '@/components/dashboard/Sidebar';

import { Topbar } from '@/components/dashboard/Topbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user) {
    redirect(
      '/login?callbackUrl=/dashboard'
    );
  }

  return (
    <div
      className="
        relative min-h-screen
        overflow-hidden
        bg-[#f5f7fb]
      "
    >

      {/* Ambient Background */}

      <div
        className="
          pointer-events-none
          absolute inset-0
        "
      >

        {/* Top Glow */}

        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-violet-200/30
            blur-3xl
          "
        />

        {/* Bottom Glow */}

        <div
          className="
            absolute
            bottom-[-180px]
            right-[-120px]
            h-[460px]
            w-[460px]
            rounded-full
            bg-cyan-200/30
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
              '42px 42px',
          }}
        />
      </div>

      {/* Main Layout */}

      <div
        className="
          relative z-10
          flex min-h-screen
        "
      >

        {/* Sidebar */}

        <Sidebar
          role={session.user.role}
        />

        {/* Content */}

        <div
          className="
            relative flex
            flex-1 flex-col
          "
        >

          {/* Floating Blur Layer */}

          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-white/40
              backdrop-blur-[2px]
            "
          />

          {/* Topbar */}

          <div className="relative z-20">
            <Topbar
              name={
                session.user.name ??
                session.user.email ??
                'You'
              }

              email={
                session.user.email ??
                ''
              }

              image={
                session.user.image ??
                null
              }

              role={
                session.user.role
              }
            />
          </div>

          {/* Page Content */}

          <main
            className="
              relative z-10
              flex-1
              px-5 pb-10 pt-5
              sm:px-8
              lg:px-10
            "
          >

            {/* Floating Content Wrapper */}

            <div
              className="
                min-h-[calc(100vh-110px)]
                rounded-[32px]
                border border-white/60
                bg-white/70
                p-5
                shadow-[0_10px_60px_rgba(15,23,42,0.08)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              {/* Animated Inner Glow */}

              <div
                className="
                  pointer-events-none
                  absolute inset-0
                  rounded-[32px]
                  ring-1 ring-white/40
                "
              />

              <div
                className="
                  relative z-10
                "
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}