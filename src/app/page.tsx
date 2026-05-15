'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

import {
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  Database,
  Workflow,
  Search,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Users,

    title: 'Lead management',

    description:
      'Store, organize, and track prospects across different outreach channels.',
  },

  {
    icon: Database,

    title: 'CSV import',

    description:
      'Bulk import lead data from spreadsheets with automatic field mapping.',
  },

  {
    icon: MessageSquare,

    title: 'AI outreach',

    description:
      'Generate personalized connection requests, follow-ups, and sales messages.',
  },

  {
    icon: Workflow,

    title: 'Pipeline tracking',

    description:
      'Move leads through custom workflow stages from discovery to conversion.',
  },

  {
    icon: Search,

    title: 'Search and filters',

    description:
      'Quickly filter leads by source, status, company, or engagement level.',
  },

  {
    icon: Shield,

    title: 'Authentication',

    description:
      'Secure access with credential login, Google OAuth, and LinkedIn OAuth.',
  },
];

export default function LandingPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#f7f7f5]
        text-neutral-950
      "
    >

      {/* Navigation */}

      <nav
        className="
          sticky top-0 z-50
          border-b border-black/5
          bg-[#f7f7f5]/80
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto flex
            h-16 max-w-7xl
            items-center
            justify-between
            px-6
          "
        >

          <Link
            href="/"
            className="
              flex items-center
              gap-3
            "
          >

            <div
              className="
                flex h-10 w-10
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              "
            >
              <Sparkles className="h-4 w-4" />
            </div>

            <div>

              <div
                className="
                  text-sm
                  font-semibold
                  tracking-tight
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
                Lead Operations
              </div>
            </div>
          </Link>

          <div
            className="
              flex items-center
              gap-3
            "
          >

            <Link
              href="/login"
              className="
                rounded-2xl
                px-4 py-2
                text-sm
                text-neutral-700
                transition
                hover:bg-black/5
              "
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="
                inline-flex
                items-center gap-2
                rounded-2xl
                bg-black
                px-5 py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              Get started

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}

      <section
        className="
          mx-auto grid
          max-w-7xl gap-16
          px-6
          py-24
          lg:grid-cols-2
          lg:items-center
        "
      >

        {/* Left */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >

          <div
            className="
              inline-flex
              items-center gap-2
              rounded-full
              border border-black/10
              bg-white
              px-4 py-2
              text-sm
              text-neutral-600
            "
          >

            <div
              className="
                h-2 w-2
                rounded-full
                bg-emerald-500
              "
            />

            Outreach workflow platform
          </div>

          <h1
            className="
              mt-8 text-5xl
              font-semibold
              tracking-tight
              text-black
              sm:text-6xl
              lg:text-7xl
            "
          >
            Manage outreach
            workflows without
            switching tools.
          </h1>

          <p
            className="
              mt-8 max-w-2xl
              text-lg leading-9
              text-neutral-600
            "
          >
            Hanexis helps teams manage
            prospect data, generate
            personalized outreach,
            organize lead pipelines,
            and streamline outbound
            communication workflows.
          </p>

          <div
            className="
              mt-10 flex
              flex-wrap items-center
              gap-4
            "
          >

            <Link
              href="/signup"
              className="
                inline-flex
                items-center gap-2
                rounded-2xl
                bg-black
                px-6 py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              Start free

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="
                rounded-2xl
                border border-black/10
                bg-white
                px-6 py-3
                text-sm
                font-medium
                text-neutral-700
                transition
                hover:bg-neutral-100
              "
            >
              Open dashboard
            </Link>
          </div>
        </motion.div>

        {/* Right */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
          className="
            rounded-[36px]
            border border-black/10
            bg-white
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          "
        >

          {/* Browser */}

          <div
            className="
              flex items-center
              gap-2 border-b
              border-black/5
              pb-4
            "
          >

            <div className="h-3 w-3 rounded-full bg-neutral-300" />
            <div className="h-3 w-3 rounded-full bg-neutral-300" />
            <div className="h-3 w-3 rounded-full bg-neutral-300" />

            <div
              className="
                ml-4 rounded-full
                bg-neutral-100
                px-3 py-1
                text-xs
                text-neutral-500
              "
            >
              app.hanexis.io
            </div>
          </div>

          {/* Dashboard Preview */}

          <div className="mt-6 space-y-4">

            <div
              className="
                grid gap-4
                md:grid-cols-3
              "
            >

              {[
                {
                  label:
                    'Total Leads',

                  value:
                    '1,284',
                },

                {
                  label:
                    'Open Outreach',

                  value:
                    '324',
                },

                {
                  label:
                    'Conversions',

                  value:
                    '86',
                },
              ].map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className="
                      rounded-3xl
                      border border-black/5
                      bg-neutral-50
                      p-5
                    "
                  >

                    <div
                      className="
                        text-sm
                        text-neutral-500
                      "
                    >
                      {
                        item.label
                      }
                    </div>

                    <div
                      className="
                        mt-2 text-4xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {
                        item.value
                      }
                    </div>
                  </div>
                )
              )}
            </div>

            <div
              className="
                rounded-3xl
                border border-black/5
                bg-neutral-50
                p-6
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
                      text-sm
                      text-neutral-500
                    "
                  >
                    Active pipeline
                  </div>

                  <div
                    className="
                      mt-1 text-xl
                      font-semibold
                    "
                  >
                    Q3 outbound campaign
                  </div>
                </div>

                <div
                  className="
                    rounded-full
                    bg-emerald-100
                    px-3 py-1
                    text-xs
                    font-medium
                    text-emerald-700
                  "
                >
                  Active
                </div>
              </div>

              <div className="mt-6 space-y-3">

                {[
                  'Imported 320 leads from CSV',
                  'Generated 58 personalized messages',
                  'Updated 14 prospects to converted',
                ].map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item
                      }
                      className="
                        flex items-center
                        gap-3 rounded-2xl
                        bg-white
                        px-4 py-3
                        text-sm
                        text-neutral-700
                      "
                    >

                      <div
                        className="
                          h-2 w-2
                          rounded-full
                          bg-black
                        "
                      />

                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}

      <section
        className="
          border-t border-black/5
          bg-white
        "
      >

        <div
          className="
            mx-auto max-w-7xl
            px-6 py-24
          "
        >

          <div
            className="
              max-w-3xl
            "
          >

            <div
              className="
                text-sm
                text-neutral-500
              "
            >
              Platform capabilities
            </div>

            <h2
              className="
                mt-3 text-4xl
                font-semibold
                tracking-tight
                sm:text-5xl
              "
            >
              Designed for modern
              outbound workflows.
            </h2>
          </div>

          <div
            className="
              mt-16 grid gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >

            {features.map(
              (
                feature,
                index
              ) => (
                <motion.div
                  key={
                    feature.title
                  }
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index *
                      0.05,
                  }}
                  className="
                    rounded-[32px]
                    border border-black/5
                    bg-[#fafafa]
                    p-7
                  "
                >

                  <div
                    className="
                      flex h-12 w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-black
                      text-white
                    "
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <h3
                    className="
                      mt-6 text-xl
                      font-semibold
                    "
                  >
                    {
                      feature.title
                    }
                  </h3>

                  <p
                    className="
                      mt-3 text-sm
                      leading-7
                      text-neutral-600
                    "
                  >
                    {
                      feature.description
                    }
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section
        className="
          mx-auto max-w-5xl
          px-6 py-24
        "
      >

        <div
          className="
            rounded-[40px]
            bg-black
            px-8 py-16
            text-center
            text-white
            sm:px-16
          "
        >

          <div
            className="
              text-sm
              text-neutral-400
            "
          >
            Start using Hanexis
          </div>

          <h2
            className="
              mt-4 text-4xl
              font-semibold
              tracking-tight
              sm:text-5xl
            "
          >
            Build and manage
            outbound campaigns
            from one workspace.
          </h2>

          <p
            className="
              mx-auto mt-6
              max-w-2xl
              text-lg leading-8
              text-neutral-300
            "
          >
            Centralize lead data,
            outreach generation,
            and prospect workflows
            inside a single platform.
          </p>

          <div
            className="
              mt-10 flex
              flex-wrap
              items-center
              justify-center
              gap-4
            "
          >

            <Link
              href="/signup"
              className="
                inline-flex
                items-center gap-2
                rounded-2xl
                bg-white
                px-6 py-3
                text-sm
                font-medium
                text-black
                transition
                hover:bg-neutral-200
              "
            >
              Create account

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="
                rounded-2xl
                border border-white/10
                px-6 py-3
                text-sm
                font-medium
                text-neutral-200
                transition
                hover:bg-white/5
              "
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer
        className="
          border-t border-black/5
          bg-white
        "
      >

        <div
          className="
            mx-auto flex
            max-w-7xl
            flex-col gap-6
            px-6 py-10
            text-sm text-neutral-500
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>
            © {new Date().getFullYear()} Hanexis
          </div>

          <div
            className="
              flex items-center
              gap-6
            "
          >

            <Link
              href="/login"
              className="
                hover:text-black
              "
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="
                hover:text-black
              "
            >
              Signup
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}