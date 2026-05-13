import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const rowSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const schema = z.object({ rows: z.array(rowSchema).min(1).max(2000) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const created = await prisma.$transaction(
    parsed.data.rows.map((r) =>
      prisma.lead.create({
        data: {
          ownerId: session.user.id,
          fullName: r.fullName,
          email: r.email || null,
          company: r.company || null,
          jobTitle: r.jobTitle || null,
          linkedinUrl: r.linkedinUrl || null,
          instagramUrl: r.instagramUrl || null,
          bio: r.bio || null,
          source: 'CSV',
          tags: r.tags?.length
            ? { create: r.tags.map((label) => ({ label: label.trim() })) }
            : undefined,
        },
      })
    )
  );
  return NextResponse.json({ count: created.length }, { status: 201 });
}
