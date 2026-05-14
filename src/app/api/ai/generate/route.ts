import { NextResponse } from 'next/server';

import { z } from 'zod';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

import { generateMessage } from '@/lib/ai';

const generateSchema = z.object({
  kind: z.enum([
    'CONNECTION',
    'FOLLOW_UP',
    'SALES_PITCH',
    'RE_ENGAGEMENT',
    'CUSTOM',
  ]),

  leadId: z.string().optional(),

  tone: z
    .enum([
      'PROFESSIONAL',
      'FRIENDLY',
      'DIRECT',
      'CONSULTATIVE',
    ])
    .optional(),

  channel: z
    .enum(['EMAIL', 'LINKEDIN', 'INSTAGRAM'])
    .optional(),

  product: z.string().max(300).optional(),

  campaignGoal: z.string().max(500).optional(),

  promptTemplate: z
    .string()
    .max(4000)
    .optional(),

  ephemeralLead: z
    .object({
      fullName: z.string().min(1),

      company: z.string().optional(),

      companyWebsite: z.string().optional(),

      jobTitle: z.string().optional(),

      bio: z.string().optional(),

      aiSummary: z.string().optional(),

      engagementScore: z.number().optional(),
    })
    .optional(),
});

async function getLeadData(
  leadId: string,
  ownerId: string
) {
  return prisma.lead.findFirst({
    where: {
      id: leadId,

      ownerId,
    },

    select: {
      id: true,

      fullName: true,

      company: true,

      companyWebsite: true,

      jobTitle: true,

      bio: true,

      aiSummary: true,

      engagementScore: true,

      status: true,
    },
  });
}

export async function POST(request: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized access',
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const parsed =
      generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload',

          issues: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    let leadData =
      parsed.data.ephemeralLead ?? null;

    if (parsed.data.leadId) {
      const lead = await getLeadData(
        parsed.data.leadId,
        session.user.id
      );

      if (!lead) {
        return NextResponse.json(
          {
            error:
              'Lead not found or inaccessible',
          },
          {
            status: 404,
          }
        );
      }

      leadData = {
        ...lead,

        company:
          lead.company ?? undefined,

        companyWebsite:
          lead.companyWebsite ?? undefined,

        jobTitle:
          lead.jobTitle ?? undefined,

        bio:
          lead.bio ?? undefined,

        aiSummary:
          lead.aiSummary ?? undefined,
      };

      /*
      |--------------------------------------------------------------------------
      | Engagement Tracking
      |--------------------------------------------------------------------------
      |
      | Updates outreach activity timestamps dynamically.
      |
      */

      await prisma.lead.update({
        where: {
          id: lead.id,
        },

        data: {
          lastContactedAt: new Date(),
        },
      });
    }

    if (!leadData) {
      return NextResponse.json(
        {
          error:
            'Provide either leadId or ephemeralLead',
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | AI Message Generation
    |--------------------------------------------------------------------------
    */

    const aiResult =
      await generateMessage({
        kind: parsed.data.kind,

        channel:
          parsed.data.channel,

        tone:
          parsed.data.tone,

        product:
          parsed.data.product,

        campaignGoal:
          parsed.data.campaignGoal,

        promptTemplate:
          parsed.data.promptTemplate,

        lead: leadData,
      });

    /*
    |--------------------------------------------------------------------------
    | AI Message Persistence
    |--------------------------------------------------------------------------
    */

    const savedMessage =
      await prisma.aiMessage.create({
        data: {
          ownerId: session.user.id,

          leadId:
            parsed.data.leadId ?? null,

          kind:
            parsed.data.kind,

          channel:
            parsed.data.channel ??
            'EMAIL',

          tone:
            parsed.data.tone ??
            'PROFESSIONAL',

          prompt:
            aiResult.prompt,

          output:
            aiResult.output,

          model:
            aiResult.model,

          personalizationScore:
            aiResult.personalizationScore,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Activity Logging
    |--------------------------------------------------------------------------
    */

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,

        action:
          'AI_MESSAGE_GENERATED',

        entityType:
          'AiMessage',

        entityId:
          savedMessage.id,

        metadata: JSON.stringify({
          kind:
            parsed.data.kind,

          channel:
            parsed.data.channel,

          personalizationScore:
            aiResult.personalizationScore,
        }),
      },
    });

    return NextResponse.json({
      success: true,

      message: {
        id: savedMessage.id,

        output:
          savedMessage.output,

        model:
          savedMessage.model,

        personalizationScore:
          savedMessage.personalizationScore,

        generatedAt:
          savedMessage.createdAt,

        reasoning:
          aiResult.reasoning,
      },
    });
  } catch (error) {
    console.error(
      '[AI_GENERATION_ERROR]',
      error
    );

    return NextResponse.json(
      {
        error:
          'AI generation failed unexpectedly',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized access',
        },
        {
          status: 401,
        }
      );
    }

    const messages =
      await prisma.aiMessage.findMany({
        where: {
          ownerId: session.user.id,
        },

        orderBy: {
          createdAt: 'desc',
        },

        take: 100,

        include: {
          lead: {
            select: {
              fullName: true,

              company: true,

              status: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,

      total: messages.length,

      messages,
    });
  } catch (error) {
    console.error(
      '[FETCH_AI_MESSAGES_ERROR]',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to fetch AI messages',
      },
      {
        status: 500,
      }
    );
  }
}