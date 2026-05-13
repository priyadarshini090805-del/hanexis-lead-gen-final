import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const createSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email().optional().nullable(),
  company: z.string().max(160).optional().nullable(),
  jobTitle: z.string().max(160).optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
  bio: z.string().max(2000).optional().nullable(),
  status: z.enum(['NEW', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'ARCHIVED']).optional(),
  source: z.enum(['MANUAL', 'CSV', 'LINKEDIN', 'INSTAGRAM']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();
  const status = url.searchParams.get('status') ?? undefined;
  const source = url.searchParams.get('source') ?? undefined;
  const tag = url.searchParams.get('tag') ?? undefined;

  const where: Prisma.LeadWhereInput = {
    ownerId: session.user.id,
    ...(status ? { status: status as any } : {}),
    ...(source ? { source: source as any } : {}),
    ...(tag ? { tags: { some: { label: tag } } } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { jobTitle: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { tags: true, _count: { select: { messages: true } } },
    take: 200,
  });

  // Aggregate stats for dashboard
  const grouped = await prisma.lead.groupBy({
    by: ['status'],
    where: { ownerId: session.user.id },
    _count: { status: true },
  });
  const stats = {
    total: leads.length,
    NEW: grouped.find((g) => g.status === 'NEW')?._count.status ?? 0,
    CONTACTED: grouped.find((g) => g.status === 'CONTACTED')?._count.status ?? 0,
    RESPONDED: grouped.find((g) => g.status === 'RESPONDED')?._count.status ?? 0,
    CONVERTED: grouped.find((g) => g.status === 'CONVERTED')?._count.status ?? 0,
    ARCHIVED: grouped.find((g) => g.status === 'ARCHIVED')?._count.status ?? 0,
  };

  return NextResponse.json({ leads, stats });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  const { tags, linkedinUrl, instagramUrl, ...rest } = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      ...rest,
      linkedinUrl: linkedinUrl || null,
      instagramUrl: instagramUrl || null,
      ownerId: session.user.id,
      tags: tags?.length
        ? { create: tags.map((label) => ({ label: label.trim() })) }
        : undefined,
    },
    include: { tags: true },
  });
  return NextResponse.json({ lead }, { status: 201 });
}
