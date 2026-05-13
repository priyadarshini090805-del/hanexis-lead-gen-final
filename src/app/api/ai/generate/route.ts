import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMessage } from '@/lib/ai';

const schema = z.object({
  kind: z.enum(['CONNECTION', 'FOLLOW_UP', 'SALES_PITCH', 'CUSTOM']),
  leadId: z.string().optional(),
  tone: z.enum(['friendly', 'professional', 'casual', 'enthusiastic']).optional(),
  product: z.string().max(300).optional(),
  promptTemplate: z.string().max(2000).optional(),
  ephemeralLead: z
    .object({
      fullName: z.string().min(1),
      company: z.string().optional(),
      jobTitle: z.string().optional(),
      bio: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  let leadData = parsed.data.ephemeralLead ?? null;
  if (parsed.data.leadId) {
    const lead = await prisma.lead.findFirst({
      where: { id: parsed.data.leadId, ownerId: session.user.id },
      select: { fullName: true, company: true, jobTitle: true, bio: true },
    });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    leadData = {
     ...lead,
     company: lead.company ?? undefined,
     jobTitle: lead.jobTitle ?? undefined,
      bio: lead.bio ?? undefined,
   };
  }
  if (!leadData) return NextResponse.json({ error: 'Provide leadId or ephemeralLead' }, { status: 400 });

  const result = await generateMessage({
    kind: parsed.data.kind,
    lead: leadData,
    tone: parsed.data.tone,
    product: parsed.data.product,
    promptTemplate: parsed.data.promptTemplate,
  });

  const saved = await prisma.aiMessage.create({
    data: {
      ownerId: session.user.id,
      leadId: parsed.data.leadId ?? null,
      kind: parsed.data.kind,
      prompt: result.prompt,
      output: result.output,
      model: result.model,
    },
  });

  return NextResponse.json({ message: saved });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const messages = await prisma.aiMessage.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { lead: { select: { fullName: true, company: true } } },
  });
  return NextResponse.json({ messages });
}
