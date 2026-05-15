import Link from 'next/link';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

import {
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

import { timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const session =
    await getServerSession(authOptions);

  const userId =
    session!.user.id;

  const [
    totalLeads,
    totalMessages,
    recentLeads,
    recentMessages,
    byStatus,
  ] = await Promise.all([
    prisma.lead.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.aiMessage.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.lead.findMany({
      where: {
        ownerId: userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 5,

      include: {
        tags: true,
      },
    }),

    prisma.aiMessage.findMany({
      where: {
        ownerId: userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 5,

      include: {
        lead: {
          select: {
            fullName: true,
            company: true,
          },
        },
      },
    }),

    prisma.lead.groupBy({
      by: ['status'],

      where: {
        ownerId: userId,
      },

      _count: {
        status: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">

      {/* Hero */}

      <section
        className="
          overflow-hidden
          rounded-[32px]
          border border-neutral-200
          bg-white
        "
      >
        <div
          className="
            px-8 py-10
            lg:px-12 lg:py-12
          "
        >

          <div
            className="
              max-w-3xl
            "
          >

            <div
              className="
                inline-flex items-center
                gap-2 rounded-full
                bg-neutral-100
                px-4 py-2
                text-xs font-medium
                uppercase tracking-[0.18em]
                text-neutral-600
              "
            >
              Hanexis Workspace
            </div>

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
              from one place.
            </h1>

            <p
              className="
                mt-5 max-w-2xl
                text-base leading-8
                text-neutral-600
              "
            >
              Track prospects,
              organize outreach,
              generate personalized
              messages,
              and monitor pipeline activity
              across your sales workflow.
            </p>

            <div
              className="
                mt-8 flex flex-wrap
                gap-3
              "
            >

              <Link
                href="/dashboard/leads"
                className="
                  inline-flex items-center
                  gap-2 rounded-2xl
                  bg-neutral-950
                  px-5 py-3
                  text-sm font-medium
                  text-white transition
                  hover:bg-black
                "
              >
                Open Leads

                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/ai-messages"
                className="
                  inline-flex items-center
                  gap-2 rounded-2xl
                  border border-neutral-200
                  bg-white px-5 py-3
                  text-sm font-medium
                  text-neutral-700
                  transition
                  hover:bg-neutral-100
                "
              >
                Generate Outreach
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}

      <section
        className="
          grid gap-5
          md:grid-cols-3
        "
      >

        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          description="Prospects currently tracked"
        />

        <MetricCard
          title="Generated Messages"
          value={totalMessages}
          icon={Sparkles}
          description="Outreach drafts created"
        />

        <MetricCard
          title="Pipeline Activity"
          value={
            byStatus.reduce(
              (
                acc,
                curr
              ) =>
                acc +
                curr._count.status,
              0
            )
          }
          icon={TrendingUp}
          description="Tracked status updates"
        />
      </section>

      {/* Charts */}

      <section
        className="
          rounded-[32px]
          border border-neutral-200
          bg-white p-7
        "
      >
        <div>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Overview
          </div>

          <h2
            className="
              mt-1 text-2xl
              font-semibold
              tracking-tight
              text-neutral-950
            "
          >
            Pipeline analytics
          </h2>
        </div>

        <div className="mt-8">
          <DashboardCharts
            byStatus={byStatus}
          />
        </div>
      </section>

      {/* Grid */}

      <section
        className="
          grid gap-6
          xl:grid-cols-2
        "
      >

        {/* Leads */}

        <div
          className="
            rounded-[32px]
            border border-neutral-200
            bg-white p-7
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
                text-neutral-600
                hover:text-black
              "
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">

            {recentLeads.length ===
            0 ? (
              <EmptyState
                title="No leads available"
                description="Create or import leads to begin tracking outreach."
                href="/dashboard/leads"
                action="Open Leads"
              />
            ) : (
              recentLeads.map(
                (lead) => (
                  <div
                    key={lead.id}
                    className="
                      rounded-3xl
                      border border-neutral-200
                      bg-neutral-50
                      p-5
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
                            font-medium
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

                        <div
                          className="
                            mt-4 flex
                            flex-wrap gap-2
                          "
                        >
                          {lead.tags
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag.id}
                                className="
                                  rounded-full
                                  border border-neutral-200
                                  bg-white
                                  px-3 py-1
                                  text-xs
                                  text-neutral-600
                                "
                              >
                                {tag.label}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div
                        className="
                          text-xs
                          text-neutral-400
                        "
                      >
                        {timeAgo(
                          lead.createdAt
                        )}
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Messages */}

        <div
          className="
            rounded-[32px]
            border border-neutral-200
            bg-white p-7
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
                text-neutral-600
                hover:text-black
              "
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">

            {recentMessages.length ===
            0 ? (
              <EmptyState
                title="No outreach generated"
                description="Generate personalized messages for your leads."
                href="/dashboard/ai-messages"
                action="Open Outreach"
              />
            ) : (
              recentMessages.map(
                (message) => (
                  <div
                    key={message.id}
                    className="
                      rounded-3xl
                      border border-neutral-200
                      bg-neutral-50
                      p-5
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
                          bg-white
                          px-3 py-1
                          text-xs
                          font-medium
                          text-neutral-700
                        "
                      >
                        {message.kind.replace(
                          '_',
                          ' '
                        )}
                      </span>

                      <span
                        className="
                          text-xs
                          text-neutral-400
                        "
                      >
                        {timeAgo(
                          message.createdAt
                        )}
                      </span>
                    </div>

                    <p
                      className="
                        mt-4 line-clamp-4
                        text-sm
                        leading-7
                        text-neutral-700
                      "
                    >
                      {message.output}
                    </p>

                    {message.lead
                      ?.fullName && (
                      <div
                        className="
                          mt-4 flex
                          items-center gap-2
                          text-xs
                          text-neutral-500
                        "
                      >
                        <MessageSquare className="h-3 w-3" />

                        {
                          message
                            .lead
                            .fullName
                        }

                        {message.lead
                          .company &&
                          ` • ${message.lead.company}`}
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      </section>
    </div>
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
    <div
      className="
        rounded-[28px]
        border border-neutral-200
        bg-white p-6
      "
    >
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
              mt-4 text-4xl
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
            items-center justify-center
            rounded-2xl
            bg-neutral-100
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
          leading-6
          text-neutral-500
        "
      >
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;

  description: string;

  href: string;

  action: string;
}) {
  return (
    <div
      className="
        rounded-[28px]
        border border-dashed
        border-neutral-300
        bg-neutral-50
        p-8
      "
    >
      <div
        className="
          text-base font-medium
          text-neutral-900
        "
      >
        {title}
      </div>

      <p
        className="
          mt-3 text-sm
          leading-7
          text-neutral-500
        "
      >
        {description}
      </p>

      <Link
        href={href}
        className="
          mt-6 inline-flex
          items-center gap-2
          rounded-2xl
          border border-neutral-200
          bg-white px-4 py-2
          text-sm font-medium
          text-neutral-700
          transition
          hover:bg-neutral-100
        "
      >
        {action}

        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}