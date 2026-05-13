import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  email: z.string().email().optional().nullable(),
  company: z.string().max(160).optional().nullable(),
  jobTitle: z.string().max(160).optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  status: z.enum(['NEW', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'ARCHIVED']).optional(),
  source: z.enum(['MANUAL', 'CSV', 'LINKEDIN', 'INSTAGRAM']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).optional(),
});

async function checkOwnership(id: string, userId: string) {
  const lead = await prisma.lead.findFirst({ where: { id, ownerId: userId } });
  return lead;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const lead = await prisma.lead.findFirst({
    where: { id: params.id, ownerId: session.user.id },
    include: { tags: true, messages: { orderBy: { createdAt: 'desc' }, take: 25 } },
  });
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkOwnership(params.id, session.user.id)))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { tags, ...rest } = parsed.data;

  const lead = await prisma.$transaction(async (tx) => {
    if (tags) {
      await tx.leadTag.deleteMany({ where: { leadId: params.id } });
      if (tags.length > 0) {
        await tx.leadTag.createMany({
          data: tags.map((label) => ({ leadId: params.id, label: label.trim() })),
          skipDuplicates: true,
        });
      }
    }
    return tx.lead.update({
      where: { id: params.id },
      data: rest,
      include: { tags: true },
    });
  });

  return NextResponse.json({ lead });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await checkOwnership(params.id, session.user.id)))
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
