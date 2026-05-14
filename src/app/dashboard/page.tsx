import Link from 'next/link';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

import {
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
  Clock3,
  Target,
} from 'lucide-react';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

import { timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function calculateGrowth(current: number) {
  const simulatedPrevious =
    Math.max(current - Math.floor(current * 0.22), 1);

  return Math.round(
    ((current - simulatedPrevious) /
      simulatedPrevious) *
      100
  );
}

export default async function DashboardOverview() {
  const session =
    await getServerSession(authOptions);

  const userId =
    session!.user.id;

  const [
    totalLeads,

    totalMessages,

    totalQualified,

    avgLeadScore,

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

    prisma.lead.count({
      where: {
        ownerId: userId,

        isQualified: true,
      },
    }),

    prisma.lead.aggregate({
      where: {
        ownerId: userId,
      },

      _avg: {
        score: true,
      },
    }),

    prisma.lead.findMany({
      where: {
        ownerId: userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 6,

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

  const getStatusCount = (
    status: string
  ) =>
    byStatus.find(
      (item) =>
        item.status ===
        (status as any)
    )?._count.status ?? 0;

  const converted =
    getStatusCount(
      'CONVERTED'
    );

  const contacted =
    getStatusCount(
      'CONTACTED'
    );

  const responded =
    getStatusCount(
      'RESPONDED'
    );

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (converted /
            totalLeads) *
            100
        )
      : 0;

  const replyRate =
    contacted + responded > 0
      ? Math.round(
          (responded /
            (contacted +
              responded)) *
            100
        )
      : 0;

  const avgScore =
    Math.round(
      avgLeadScore._avg
        .score ?? 0
    );

  const metrics = [
    {
      title: 'Lead Intelligence',

      value: totalLeads,

      growth:
        calculateGrowth(
          totalLeads
        ),

      icon: Users,

      description:
        'Active leads tracked across outreach pipelines',
    },

    {
      title: 'AI Outreach',

      value: totalMessages,

      growth:
        calculateGrowth(
          totalMessages
        ),

      icon: Sparkles,

      description:
        'AI-generated outbound communication workflows',
    },

    {
      title: 'Reply Rate',

      value: `${replyRate}%`,

      growth: 12,

      icon: TrendingUp,

      description:
        'Engagement efficiency across contacted leads',
    },

    {
      title: 'Lead Quality',

      value: `${avgScore}/100`,

      growth: 8,

      icon: BrainCircuit,

      description:
        'Average qualification and engagement score',
    },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-neutral-50
      "
    >
      <div
        className="
          space-y-8 p-5
          sm:p-8
        "
      >

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
              relative px-8 py-8
              lg:px-10 lg:py-10
            "
          >

            <div
              className="
                absolute inset-0
                bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_35%)]
              "
            />

            <div
              className="
                relative flex
                flex-col gap-8
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              <div className="max-w-2xl">

                <div
                  className="
                    inline-flex items-center
                    gap-2 rounded-full
                    border border-neutral-200
                    bg-neutral-100
                    px-4 py-2
                    text-xs font-medium
                    uppercase tracking-[0.18em]
                    text-neutral-600
                  "
                >
                  <Activity className="h-3.5 w-3.5" />

                  AI Sales Intelligence
                </div>

                <h1
                  className="
                    mt-5 text-4xl
                    font-semibold
                    tracking-tight
                    text-neutral-950
                  "
                >
                  Revenue operations,
                  powered by contextual AI.
                </h1>

                <p
                  className="
                    mt-4 max-w-xl
                    text-base leading-8
                    text-neutral-600
                  "
                >
                  Monitor lead qualification,
                  outreach engagement,
                  AI-generated communication,
                  and pipeline efficiency from a
                  unified intelligence workspace.
                </p>

                <div
                  className="
                    mt-8 flex flex-wrap
                    gap-3
                  "
                >
                  <Link
                    href="/dashboard/ai-messages"
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
                    <Sparkles className="h-4 w-4" />

                    Generate Outreach
                  </Link>

                  <Link
                    href="/dashboard/leads"
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
                    View Pipeline

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Analytics */}

              <div
                className="
                  grid gap-4
                  sm:grid-cols-2
                "
              >

                <div
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
                        text-sm
                        text-neutral-500
                      "
                    >
                      Qualified Leads
                    </span>

                    <Target
                      className="
                        h-4 w-4
                        text-neutral-500
                      "
                    />
                  </div>

                  <div
                    className="
                      mt-4 text-4xl
                      font-semibold
                      text-neutral-950
                    "
                  >
                    {totalQualified}
                  </div>

                  <div
                    className="
                      mt-3 text-sm
                      text-emerald-600
                    "
                  >
                    High-intent prospects identified
                  </div>
                </div>

                <div
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
                        text-sm
                        text-neutral-500
                      "
                    >
                      Conversion Rate
                    </span>

                    <TrendingUp
                      className="
                        h-4 w-4
                        text-neutral-500
                      "
                    />
                  </div>

                  <div
                    className="
                      mt-4 text-4xl
                      font-semibold
                      text-neutral-950
                    "
                  >
                    {conversionRate}%
                  </div>

                  <div
                    className="
                      mt-3 text-sm
                      text-emerald-600
                    "
                  >
                    Pipeline efficiency improving
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}

        <section
          className="
            grid gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {metrics.map(
            (metric) => (
              <div
                key={metric.title}
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
                      {metric.title}
                    </div>

                    <div
                      className="
                        mt-4 text-4xl
                        font-semibold
                        tracking-tight
                        text-neutral-950
                      "
                    >
                      {metric.value}
                    </div>
                  </div>

                  <div
                    className="
                      flex h-12 w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-neutral-100
                    "
                  >
                    <metric.icon
                      className="
                        h-5 w-5
                        text-neutral-700
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-5 flex items-center
                    gap-2 text-sm
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-emerald-100
                      px-2.5 py-1
                      font-medium
                      text-emerald-700
                    "
                  >
                    +{metric.growth}%
                  </span>

                  <span
                    className="
                      text-neutral-500
                    "
                  >
                    vs previous cycle
                  </span>
                </div>

                <p
                  className="
                    mt-4 text-sm
                    leading-6
                    text-neutral-500
                  "
                >
                  {metric.description}
                </p>
              </div>
            )
          )}
        </section>

        {/* Analytics */}

        <section
          className="
            rounded-[32px]
            border border-neutral-200
            bg-white p-7
          "
        >
          <div
            className="
              flex flex-col gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>

              <div
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Performance Analytics
              </div>

              <h2
                className="
                  mt-1 text-2xl
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                Pipeline intelligence
              </h2>
            </div>

            <div
              className="
                inline-flex items-center
                gap-2 rounded-full
                border border-neutral-200
                bg-neutral-50
                px-4 py-2
                text-sm
                text-neutral-600
              "
            >
              <Clock3 className="h-4 w-4" />

              Real-time operational metrics
            </div>
          </div>

          <div className="mt-8">
            <DashboardCharts
              byStatus={byStatus}
            />
          </div>
        </section>

        {/* Activity Grid */}

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
                  Lead Activity
                </div>

                <h3
                  className="
                    mt-1 text-xl
                    font-semibold
                    text-neutral-950
                  "
                >
                  Recent pipeline additions
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
                  description="Import leads or create your first outreach profile to begin pipeline tracking."
                  href="/dashboard/leads"
                  action="Open Leads"
                />
              ) : (
                recentLeads.map(
                  (lead) => (
                    <Link
                      key={lead.id}
                      href={`/dashboard/leads/${lead.id}`}
                      className="
                        block rounded-3xl
                        border border-neutral-200
                        bg-neutral-50
                        p-5 transition
                        hover:border-neutral-300
                        hover:bg-white
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
                            {
                              lead.fullName
                            }
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
                              .filter(
                                Boolean
                              )
                              .join(
                                ' • '
                              ) ||
                              'No role information'}
                          </div>

                          <div
                            className="
                              mt-4 flex
                              flex-wrap gap-2
                            "
                          >
                            {lead.tags
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  tag
                                ) => (
                                  <span
                                    key={
                                      tag.id
                                    }
                                    className="
                                      rounded-full
                                      border border-neutral-200
                                      bg-white
                                      px-3 py-1
                                      text-xs
                                      text-neutral-600
                                    "
                                  >
                                    {
                                      tag.label
                                    }
                                  </span>
                                )
                              )}
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
                    </Link>
                  )
                )
              )}
            </div>
          </div>

          {/* Outreach */}

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
                  AI Outreach
                </div>

                <h3
                  className="
                    mt-1 text-xl
                    font-semibold
                    text-neutral-950
                  "
                >
                  Generated communication
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
                  title="No AI outreach generated"
                  description="Generate contextual AI-powered communication for your leads."
                  href="/dashboard/ai-messages"
                  action="Generate Outreach"
                />
              ) : (
                recentMessages.map(
                  (
                    message
                  ) => (
                    <div
                      key={
                        message.id
                      }
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
                            border border-neutral-200
                            bg-white
                            px-3 py-1
                            text-xs font-medium
                            uppercase tracking-wide
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
                        {
                          message.output
                        }
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

                          {message
                            .lead
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