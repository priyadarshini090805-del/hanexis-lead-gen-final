import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SEED_PROMPTS } from '@/lib/ai';
import { MessageKind } from '@prisma/client';

const createSchema = z.object({
  name: z.string().min(1).max(100),

  kind: z.enum([
    'CONNECTION',
    'FOLLOW_UP',
    'SALES_PITCH',
    'CUSTOM',
  ]),

  body: z.string().min(1).max(4000),
});

async function ensureSeeded(userId: string) {
  const count = await prisma.promptTemplate.count({
    where: {
      ownerId: userId,
    },
  });

  if (count > 0) return;

  await prisma.promptTemplate.createMany({
    data: SEED_PROMPTS.map((prompt) => ({
      ownerId: userId,

      isDefault: true,

      name: prompt.name,

      body: prompt.body,

      kind: prompt.kind as MessageKind,
    })),
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await ensureSeeded(session.user.id);

  const prompts = await prisma.promptTemplate.findMany({
    where: {
      ownerId: session.user.id,
    },

    orderBy: [
      {
        isDefault: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();

  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid input',
      },
      {
        status: 400,
      }
    );
  }

  const prompt = await prisma.promptTemplate.create({
    data: {
      ownerId: session.user.id,

      isDefault: false,

      name: parsed.data.name,

      body: parsed.data.body,

      kind: parsed.data.kind as MessageKind,
    },
  });

  return NextResponse.json(
    { prompt },
    { status: 201 }
  );
}