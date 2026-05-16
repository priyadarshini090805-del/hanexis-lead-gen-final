import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

import { DashboardOverviewClient } from '@/components/dashboard/DashboardOverviewClient';

export const dynamic =
  'force-dynamic';

export default async function DashboardOverview() {
  const session =
    await getServerSession(
      authOptions
    );

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
        createdAt:
          'desc',
      },

      take: 5,
    }),

    prisma.aiMessage.findMany(
      {
        where: {
          ownerId:
            userId,
        },

        orderBy: {
          createdAt:
            'desc',
        },

        take: 5,
      }
    ),

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
    <DashboardOverviewClient
      totalLeads={
        totalLeads
      }
      totalMessages={
        totalMessages
      }
      pipelineActivity={byStatus.reduce(
        (
          acc,
          curr
        ) =>
          acc +
          curr._count
            .status,
        0
      )}
      recentLeads={
        recentLeads
      }
      recentMessages={
        recentMessages
      }
    />
  );
}