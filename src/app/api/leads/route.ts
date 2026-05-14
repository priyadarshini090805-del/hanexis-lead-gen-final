import { NextResponse } from 'next/server';

import { z } from 'zod';

import { Prisma } from '@prisma/client';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

const createLeadSchema = z.object({
  fullName:
    z.string().min(1).max(120),

  email:
    z.string().email().optional().nullable(),

  phone:
    z.string().max(40).optional().nullable(),

  company:
    z.string().max(160).optional().nullable(),

  companyWebsite:
    z.string().url().optional().nullable(),

  jobTitle:
    z.string().max(160).optional().nullable(),

  linkedinUrl:
    z.string().url().optional().nullable().or(z.literal('')),

  instagramUrl:
    z.string().url().optional().nullable().or(z.literal('')),

  bio:
    z.string().max(3000).optional().nullable(),

  notes:
    z.string().max(5000).optional().nullable(),

  status:
    z.enum([
      'NEW',
      'QUALIFIED',
      'CONTACTED',
      'RESPONDED',
      'NEGOTIATING',
      'CONVERTED',
      'LOST',
      'ARCHIVED',
    ])
    .optional(),

  source:
    z.enum([
      'MANUAL',
      'CSV',
      'LINKEDIN',
      'INSTAGRAM',
      'WEBSITE',
      'REFERRAL',
      'API',
    ])
    .optional(),

  score:
    z.number().int().min(0).max(100).optional(),

  engagementScore:
    z.number().int().min(0).max(100).optional(),

  isQualified:
    z.boolean().optional(),

  tags:
    z.array(
      z.string().min(1).max(40)
    )
    .optional(),
});

function normalizeTags(
  tags?: string[]
) {
  if (!tags?.length) {
    return [];
  }

  return [
    ...new Set(
      tags.map((tag) =>
        tag.trim().toLowerCase()
      )
    ),
  ];
}

export async function GET(
  request: Request
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            'Unauthorized access',
        },
        {
          status: 401,
        }
      );
    }

    const url = new URL(
      request.url
    );

    const q =
      url.searchParams
        .get('q')
        ?.trim() || '';

    const status =
      url.searchParams.get(
        'status'
      ) || undefined;

    const source =
      url.searchParams.get(
        'source'
      ) || undefined;

    const tag =
      url.searchParams.get(
        'tag'
      ) || undefined;

    const qualified =
      url.searchParams.get(
        'qualified'
      ) || undefined;

    const sortBy =
      url.searchParams.get(
        'sortBy'
      ) || 'latest';

    /*
    |--------------------------------------------------------------------------
    | Dynamic Query Construction
    |--------------------------------------------------------------------------
    */

    const where: Prisma.LeadWhereInput =
      {
        ownerId:
          session.user.id,

        ...(status
          ? {
              status:
                status as any,
            }
          : {}),

        ...(source
          ? {
              source:
                source as any,
            }
          : {}),

        ...(qualified ===
        'true'
          ? {
              isQualified:
                true,
            }
          : {}),

        ...(tag
          ? {
              tags: {
                some: {
                  label: tag,
                },
              },
            }
          : {}),

        ...(q
          ? {
              OR: [
                {
                  fullName: {
                    contains:
                      q,

                    mode:
                      'insensitive',
                  },
                },

                {
                  email: {
                    contains:
                      q,

                    mode:
                      'insensitive',
                  },
                },

                {
                  company: {
                    contains:
                      q,

                    mode:
                      'insensitive',
                  },
                },

                {
                  jobTitle: {
                    contains:
                      q,

                    mode:
                      'insensitive',
                  },
                },

                {
                  bio: {
                    contains:
                      q,

                    mode:
                      'insensitive',
                  },
                },
              ],
            }
          : {}),
      };

    /*
    |--------------------------------------------------------------------------
    | Sorting Strategies
    |--------------------------------------------------------------------------
    */

    const orderBy:
      | Prisma.LeadOrderByWithRelationInput
      | Prisma.LeadOrderByWithRelationInput[] =
      sortBy === 'score'
        ? {
            score: 'desc',
          }
        : sortBy ===
          'engagement'
        ? {
            engagementScore:
              'desc',
          }
        : {
            updatedAt: 'desc',
          };

    const leads =
      await prisma.lead.findMany({
        where,

        orderBy,

        take: 200,

        include: {
          tags: true,

          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Dashboard Analytics
    |--------------------------------------------------------------------------
    */

    const grouped =
      await prisma.lead.groupBy({
        by: ['status'],

        where: {
          ownerId:
            session.user.id,
        },

        _count: {
          status: true,
        },
      });

    const stats = {
      total: leads.length,

      NEW:
        grouped.find(
          (g) =>
            g.status === 'NEW'
        )?._count.status ?? 0,

      QUALIFIED:
        grouped.find(
          (g) =>
            g.status ===
            'QUALIFIED'
        )?._count.status ?? 0,

      CONTACTED:
        grouped.find(
          (g) =>
            g.status ===
            'CONTACTED'
        )?._count.status ?? 0,

      RESPONDED:
        grouped.find(
          (g) =>
            g.status ===
            'RESPONDED'
        )?._count.status ?? 0,

      NEGOTIATING:
        grouped.find(
          (g) =>
            g.status ===
            'NEGOTIATING'
        )?._count.status ?? 0,

      CONVERTED:
        grouped.find(
          (g) =>
            g.status ===
            'CONVERTED'
        )?._count.status ?? 0,

      LOST:
        grouped.find(
          (g) =>
            g.status ===
            'LOST'
        )?._count.status ?? 0,
    };

    return NextResponse.json({
      success: true,

      total: leads.length,

      stats,

      leads,
    });
  } catch (error) {
    console.error(
      '[FETCH_LEADS_ERROR]',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch leads',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            'Unauthorized access',
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      createLeadSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            'Invalid lead payload',

          details:
            parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      tags,

      linkedinUrl,

      instagramUrl,

      companyWebsite,

      ...rest
    } = parsed.data;

    /*
    |--------------------------------------------------------------------------
    | Intelligent Lead Qualification
    |--------------------------------------------------------------------------
    */

    const qualificationScore =
      (
        (rest.company
          ? 20
          : 0) +
        (rest.jobTitle
          ? 20
          : 0) +
        (rest.bio
          ? 25
          : 0) +
        (linkedinUrl
          ? 20
          : 0) +
        ((tags?.length ?? 0) > 0
          ? 15
          : 0)
      );

    const isQualified =
      qualificationScore >= 60;

    const normalizedTags =
      normalizeTags(tags);

    const lead =
      await prisma.lead.create({
        data: {
          ...rest,

          ownerId:
            session.user.id,

          companyWebsite:
            companyWebsite ||
            null,

          linkedinUrl:
            linkedinUrl ||
            null,

          instagramUrl:
            instagramUrl ||
            null,

          isQualified,

          engagementScore:
            parsed.data
              .engagementScore ??
            Math.floor(
              Math.random() * 40 +
                40
            ),

          tags:
            normalizedTags.length
              ? {
                  create:
                    normalizedTags.map(
                      (
                        label
                      ) => ({
                        label,
                      })
                    ),
                }
              : undefined,
        },

        include: {
          tags: true,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Activity Tracking
    |--------------------------------------------------------------------------
    */

    await prisma.activityLog.create({
      data: {
        userId:
          session.user.id,

        action:
          'LEAD_CREATED',

        entityType:
          'Lead',

        entityId: lead.id,

        metadata:
          JSON.stringify({
            qualified:
              isQualified,

            source:
              lead.source,

            score:
              lead.score,
          }),
      },
    });

    return NextResponse.json(
      {
        success: true,

        lead,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      '[CREATE_LEAD_ERROR]',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to create lead',
      },
      {
        status: 500,
      }
    );
  }
}