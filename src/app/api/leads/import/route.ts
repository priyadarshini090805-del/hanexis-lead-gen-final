import { NextResponse } from 'next/server';

import { z } from 'zod';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

const rowSchema = z.object({
  fullName:
    z.string().min(1),

  email:
    z.string().email().optional().nullable(),

  company:
    z.string().optional().nullable(),

  companyWebsite:
    z.string().optional().nullable(),

  jobTitle:
    z.string().optional().nullable(),

  linkedinUrl:
    z.string().optional().nullable(),

  instagramUrl:
    z.string().optional().nullable(),

  bio:
    z.string().optional().nullable(),

  tags:
    z.array(z.string()).optional(),
});

const importSchema = z.object({
  rows:
    z.array(rowSchema)
      .min(1)
      .max(2000),
});

function normalizeString(
  value?: string | null
) {
  return value?.trim() || null;
}

function normalizeTags(
  tags?: string[]
) {
  if (!tags?.length) {
    return [];
  }

  return [
    ...new Set(
      tags.map((tag) =>
        tag
          .trim()
          .toLowerCase()
      )
    ),
  ];
}

/*
|--------------------------------------------------------------------------
| Lightweight Lead Intelligence Scoring
|--------------------------------------------------------------------------
|
| Simulates enrichment and qualification logic.
|
*/

function calculateLeadScore(
  row: z.infer<
    typeof rowSchema
  >
) {
  let score = 25;

  if (row.company) {
    score += 15;
  }

  if (row.jobTitle) {
    score += 15;
  }

  if (row.linkedinUrl) {
    score += 20;
  }

  if (row.bio) {
    score += 15;
  }

  if (
    row.tags?.length
  ) {
    score += 10;
  }

  return Math.min(
    score,
    100
  );
}

function generateAiSummary(
  row: z.infer<
    typeof rowSchema
  >
) {
  return `
Potential lead working in ${
    row.jobTitle ||
    'business operations'
  } at ${
    row.company ||
    'an unidentified company'
  }.

Likely relevant for outbound engagement and personalized AI-driven outreach campaigns.
  `.trim();
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
      importSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            'Invalid CSV payload',

          details:
            parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      parsed.data.rows;

    /*
    |--------------------------------------------------------------------------
    | Duplicate Detection
    |--------------------------------------------------------------------------
    */

    const existingEmails =
      await prisma.lead.findMany({
        where: {
          ownerId:
            session.user.id,

          email: {
            in: rows
              .map(
                (
                  row
                ) =>
                  row.email
              )
              .filter(
                Boolean
              ) as string[],
          },
        },

        select: {
          email: true,
        },
      });

    const existingSet =
      new Set(
        existingEmails.map(
          (
            item
          ) =>
            item.email
        )
      );

    const uniqueRows =
      rows.filter(
        (row) =>
          !row.email ||
          !existingSet.has(
            row.email
          )
      );

    /*
    |--------------------------------------------------------------------------
    | Bulk Lead Ingestion
    |--------------------------------------------------------------------------
    */

    const created =
      await prisma.$transaction(
        uniqueRows.map(
          (row) => {
            const score =
              calculateLeadScore(
                row
              );

            const normalizedTags =
              normalizeTags(
                row.tags
              );

            return prisma.lead.create(
              {
                data: {
                  ownerId:
                    session.user
                      .id,

                  fullName:
                    normalizeString(
                      row.fullName
                    )!,

                  email:
                    normalizeString(
                      row.email
                    ),

                  company:
                    normalizeString(
                      row.company
                    ),

                  companyWebsite:
                    normalizeString(
                      row.companyWebsite
                    ),

                  jobTitle:
                    normalizeString(
                      row.jobTitle
                    ),

                  linkedinUrl:
                    normalizeString(
                      row.linkedinUrl
                    ),

                  instagramUrl:
                    normalizeString(
                      row.instagramUrl
                    ),

                  bio:
                    normalizeString(
                      row.bio
                    ),

                  source:
                    'CSV',

                  score,

                  engagementScore:
                    Math.floor(
                      Math.random() *
                        40 +
                        40
                    ),

                  isQualified:
                    score >= 60,

                  aiSummary:
                    generateAiSummary(
                      row
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
              }
            );
          }
        )
      );

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
          'CSV_IMPORT_COMPLETED',

        entityType:
          'LeadImport',

        metadata:
          JSON.stringify({
            imported:
              created.length,

            duplicatesSkipped:
              rows.length -
              uniqueRows.length,
          }),
      },
    });

    return NextResponse.json(
      {
        success: true,

        imported:
          created.length,

        duplicatesSkipped:
          rows.length -
          uniqueRows.length,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      '[CSV_IMPORT_ERROR]',
      error
    );

    return NextResponse.json(
      {
        error:
          'CSV import failed',
      },
      {
        status: 500,
      }
    );
  }
}