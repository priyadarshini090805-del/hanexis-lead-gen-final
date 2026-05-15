import { NextResponse } from 'next/server';

import { z } from 'zod';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

import { generateMessage } from '@/lib/ai';

const schema = z.object({
  kind: z.enum([
    'CONNECTION',
    'FOLLOW_UP',
    'SALES_PITCH',
    'CUSTOM',
  ]),

  tone:
  z.enum([
    'FRIENDLY',
    'PROFESSIONAL',
    'CASUAL',
    'ENTHUSIASTIC',
  ])
  .optional(),

  product: z
    .string()
    .optional(),

  promptTemplate:
    z.string().optional(),

  ephemeralLead:
    z.object({
      fullName:
        z.string(),

      company:
        z.string().optional(),

      jobTitle:
        z.string().optional(),

      bio:
        z.string().optional(),
    }),
});

export async function POST(
  req: Request
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },

        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const parsed =
      schema.safeParse(
        body
      );

    if (
      !parsed.success
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid input',

          details:
            parsed.error.flatten(),
        },

        {
          status: 400,
        }
      );
    }

    const result =
      await generateMessage({
        kind:
          parsed.data.kind,

        tone:
          parsed.data.tone,

        product:
          parsed.data.product,

        promptTemplate:
          parsed.data
            .promptTemplate,

        lead:
          parsed.data
            .ephemeralLead,
      });

    const saved =
      await prisma.aiMessage.create(
        {
          data: {
            ownerId:
              session
                .user.id,

            kind:
              parsed.data
                .kind,

            prompt:
              result.prompt,

            output:
              result.output,

            model:
              result.model,
          },
        }
      );

    return NextResponse.json(
      {
        message: saved,
      }
    );
  } catch (error) {
    console.error(
      'AI GENERATION ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Internal server error',
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
      await getServerSession(
        authOptions
      );

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },

        {
          status: 401,
        }
      );
    }

    const messages =
      await prisma.aiMessage.findMany(
        {
          where: {
            ownerId:
              session
                .user.id,
          },

          orderBy: {
            createdAt:
              'desc',
          },

          take: 20,
        }
      );

    return NextResponse.json(
      {
        messages,
      }
    );
  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed fetching messages',
      },

      {
        status: 500,
      }
    );
  }
}