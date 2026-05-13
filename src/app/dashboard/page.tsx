import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock3,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [
    totalLeads,
    byStatus,
    recentLeads,
    recentMessages,
    totalMessages,
  ] = await Promise.all([
    prisma.lead.count({
      where: { ownerId: userId },
    }),

    prisma.lead.groupBy({
      by: ['status'],
      where: { ownerId: userId },
      _count: { status: true },
    }),

    prisma.lead.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { tags: true },
    }),

    prisma.aiMessage.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        lead: {
          select: {
            fullName: true,
          },
        },
      },
    }),

    prisma.aiMessage.count({
      where: { ownerId: userId },
    }),
  ]);

  const get = (s: string) =>
    byStatus.find((b) => b.status === (s as any))?._count.status ?? 0;

  const converted = get('CONVERTED');
  const responded = get('RESPONDED');
  const contacted = get('CONTACTED');

  const conversionRate = totalLeads
    ? Math.round((converted / totalLeads) * 100)
    : 0;

  const replyRate =
    contacted + responded
      ? Math.round((responded / (contacted + responded)) * 100)
      : 0;

  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      helper: 'Tracked in pipeline',
    },
    {
      label: 'Messages Sent',
      value: totalMessages,
      icon: MessageSquare,
      helper: 'AI-generated outreach',
    },
    {
      label: 'Reply Rate',
      value: `${replyRate}%`,
      icon: TrendingUp,
      helper: 'Based on contacted leads',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: Clock3,
      helper: 'Converted opportunities',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="text-sm font-medium text-gray-500">
              Dashboard
            </div>

            <h1 className="mt-1 text-2xl font-semibold text-gray-900">
              Sales Pipeline Overview
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Monitor lead activity, outreach performance, and recent engagement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              View Leads
            </Link>

            <Link
              href="/dashboard/ai-messages"
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus className="h-4 w-4" />
              Generate Message
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {item.label}
                </span>

                <item.icon className="h-4 w-4 text-gray-400" />
              </div>

              <div className="mt-4 text-3xl font-semibold text-gray-900">
                {item.value}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {item.helper}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Pipeline Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of leads across pipeline stages.
            </p>
          </div>

          <DashboardCharts byStatus={byStatus} />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 xl:grid-cols-2">

          {/* Recent Leads */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Leads
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Latest contacts added to the workspace.
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                View all
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <EmptyState
                title="No leads added"
                description="Import a CSV or create your first lead to begin tracking outreach."
                href="/dashboard/leads"
                action="Add Lead"
              />
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="block rounded-md border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.fullName}
                        </div>

                        <div className="mt-1 text-sm text-gray-500">
                          {[lead.jobTitle, lead.company]
                            .filter(Boolean)
                            .join(' • ') || 'No role information'}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(lead.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Outreach
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Latest AI-generated communication drafts.
                </p>
              </div>

              <Link
                href="/dashboard/ai-messages"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                View all
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <EmptyState
                title="No outreach generated"
                description="Create your first personalized message using AI templates."
                href="/dashboard/ai-messages"
                action="Generate Message"
              />
            ) : (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-md border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                        {message.kind.replace('_', ' ')}
                      </span>

                      <span className="text-xs text-gray-400">
                        {timeAgo(message.createdAt)}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-gray-700">
                      {message.output}
                    </p>

                    {message.lead?.fullName && (
                      <div className="mt-3 text-xs text-gray-500">
                        Lead: {message.lead.fullName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
      <div className="text-sm font-medium text-gray-900">
        {title}
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}