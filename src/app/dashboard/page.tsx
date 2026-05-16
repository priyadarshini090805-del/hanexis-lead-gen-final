'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

import {
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Users,
  Sparkles,
  Activity,
} from 'lucide-react';

interface DashboardOverviewClientProps {
  totalLeads: number;

  totalMessages: number;

  pipelineActivity: number;

  recentLeads: any[];

  recentMessages: any[];
}

const container = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
    },
  },
};

function DashboardOverviewClient({
  totalLeads,
  totalMessages,
  pipelineActivity,
  recentLeads,
  recentMessages,
}: DashboardOverviewClientProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >

      {/* Hero */}

      <motion.section
        variants={item}
        className="
          relative overflow-hidden
          rounded-[38px]
          border border-white/50
          bg-white/70
          shadow-[0_10px_60px_rgba(15,23,42,0.06)]
          backdrop-blur-2xl
        "
      >

        {/* Ambient */}

        <div
          className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
          "
        >

          <div
            className="
              absolute right-[-120px]
              top-[-120px]
              h-[320px] w-[320px]
              rounded-full
              bg-violet-300/10
              blur-3xl
            "
          />

          <div
            className="
              absolute left-[-80px]
              bottom-[-120px]
              h-[260px] w-[260px]
              rounded-full
              bg-cyan-300/10
              blur-3xl
            "
          />
        </div>

        <div
          className="
            relative z-10
            px-8 py-10
            lg:px-12 lg:py-12
          "
        >

          <div className="max-w-3xl">

            <motion.div
              whileHover={{
                y: -1,
              }}
              className="
                inline-flex items-center
                gap-2 rounded-full
                border border-white/60
                bg-white/70
                px-4 py-2
                text-xs font-medium
                uppercase tracking-[0.18em]
                text-neutral-600
                backdrop-blur-xl
              "
            >

              <Activity className="h-3.5 w-3.5" />

              Hanexis Workspace
            </motion.div>

            <h1
              className="
                mt-6 text-5xl
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              Manage leads,
              outreach,
              and conversations
              intelligently.
            </h1>

            <p
              className="
                mt-5 max-w-2xl
                text-base leading-8
                text-neutral-600
              "
            >
              AI-assisted relationship
              management for modern
              outbound workflows and
              personalized engagement.
            </p>

            <div
              className="
                mt-8 flex flex-wrap
                gap-3
              "
            >

              <motion.div
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >

                <Link
                  href="/dashboard/leads"
                  className="
                    inline-flex items-center
                    gap-2 rounded-2xl
                    bg-neutral-950
                    px-5 py-3
                    text-sm font-medium
                    text-white
                    shadow-lg transition-all
                    duration-300
                    hover:shadow-xl
                  "
                >
                  Open Leads

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >

                <Link
                  href="/dashboard/ai-messages"
                  className="
                    inline-flex items-center
                    gap-2 rounded-2xl
                    border border-white/60
                    bg-white/70
                    px-5 py-3
                    text-sm font-medium
                    text-neutral-700
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:shadow-lg
                  "
                >
                  Generate Outreach
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Metrics */}

      <motion.section
        variants={item}
        className="
          grid gap-5
          md:grid-cols-3
        "
      >

        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          description="Tracked prospects"
        />

        <MetricCard
          title="AI Outreach"
          value={totalMessages}
          icon={Sparkles}
          description="Generated messages"
        />

        <MetricCard
          title="Pipeline Activity"
          value={pipelineActivity}
          icon={TrendingUp}
          description="Active workflow signals"
        />
      </motion.section>

      {/* Grid */}

      <motion.section
        variants={item}
        className="
          grid gap-6
          xl:grid-cols-2
        "
      >

        {/* Leads */}

        <div
          className="
            rounded-[34px]
            border border-white/50
            bg-white/70
            p-7
            shadow-[0_10px_40px_rgba(15,23,42,0.05)]
            backdrop-blur-2xl
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
                Leads
              </div>

              <h3
                className="
                  mt-1 text-xl
                  font-semibold
                  text-neutral-950
                "
              >
                Recently added
              </h3>
            </div>

            <Link
              href="/dashboard/leads"
              className="
                text-sm font-medium
                text-neutral-500
                transition
                hover:text-black
              "
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">

            {recentLeads.map(
              (
                lead,
                index
              ) => (
                <motion.div
                  key={lead.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  className="
                    rounded-[28px]
                    border border-white/50
                    bg-white/80
                    p-5
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:shadow-lg
                  "
                >

                  <div
                    className="
                      flex items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <div
                        className="
                          text-base
                          font-semibold
                          text-neutral-950
                        "
                      >
                        {lead.fullName}
                      </div>

                      <div
                        className="
                          mt-2 text-sm
                          text-neutral-500
                        "
                      >
                        {[
                          lead.jobTitle,
                          lead.company,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </div>
                    </div>

                    <div
                      className="
                        text-xs
                        text-neutral-400
                      "
                    >
                      Recent
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Messages */}

        <div
          className="
            rounded-[34px]
            border border-white/50
            bg-white/70
            p-7
            shadow-[0_10px_40px_rgba(15,23,42,0.05)]
            backdrop-blur-2xl
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
                Outreach
              </div>

              <h3
                className="
                  mt-1 text-xl
                  font-semibold
                  text-neutral-950
                "
              >
                Recent drafts
              </h3>
            </div>

            <Link
              href="/dashboard/ai-messages"
              className="
                text-sm font-medium
                text-neutral-500
                transition
                hover:text-black
              "
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">

            {recentMessages.map(
              (
                message,
                index
              ) => (
                <motion.div
                  key={message.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  className="
                    rounded-[28px]
                    border border-white/50
                    bg-white/80
                    p-5
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:shadow-lg
                  "
                >

                  <div
                    className="
                      flex items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        rounded-full
                        border border-white/50
                        bg-white/70
                        px-3 py-1
                        text-xs
                        font-medium
                        text-neutral-700
                      "
                    >
                      {message.kind}
                    </span>

                    <MessageSquare
                      className="
                        h-4 w-4
                        text-neutral-400
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-4 line-clamp-4
                      text-sm leading-7
                      text-neutral-700
                    "
                  >
                    {message.output}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;

  value: string | number;

  icon: any;

  description: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        relative overflow-hidden
        rounded-[32px]
        border border-white/50
        bg-white/70
        p-6
        shadow-[0_10px_40px_rgba(15,23,42,0.05)]
        backdrop-blur-2xl
      "
    >

      <div
        className="
          absolute right-[-30px]
          top-[-30px]
          h-32 w-32
          rounded-full
          bg-violet-200/10
          blur-2xl
        "
      />

      <div className="relative z-10">

        <div
          className="
            flex items-start
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
              {title}
            </div>

            <div
              className="
                mt-4 text-5xl
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              {value}
            </div>
          </div>

          <div
            className="
              flex h-12 w-12
              items-center
              justify-center
              rounded-2xl
              bg-white
              shadow-sm
            "
          >

            <Icon
              className="
                h-5 w-5
                text-neutral-700
              "
            />
          </div>
        </div>

        <p
          className="
            mt-5 text-sm
            leading-7
            text-neutral-500
          "
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}