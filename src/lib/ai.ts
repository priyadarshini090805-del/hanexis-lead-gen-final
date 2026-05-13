// AI Personalization Service
// Wraps OpenAI when OPENAI_API_KEY is set; otherwise uses a high-quality mock generator.

import { MessageKind } from '@prisma/client';

export interface GenerateInput {
  kind: MessageKind;
  lead: {
    fullName: string;
    company?: string | null;
    jobTitle?: string | null;
    bio?: string | null;
  };
  promptTemplate?: string | null;
  tone?: 'friendly' | 'professional' | 'casual' | 'enthusiastic';
  product?: string | null; // what you're selling/offering
}

export interface GenerateResult {
  output: string;
  model: string;
  prompt: string;
}

const TONE_LABEL: Record<NonNullable<GenerateInput['tone']>, string> = {
  friendly: 'warm and friendly',
  professional: 'professional and concise',
  casual: 'casual and conversational',
  enthusiastic: 'energetic and enthusiastic',
};

function buildPrompt(input: GenerateInput): string {
  const tone = TONE_LABEL[input.tone ?? 'professional'];
  const { fullName, company, jobTitle, bio } = input.lead;
  const product = input.product?.trim() || 'our service';

  const kindInstruction: Record<MessageKind, string> = {
    CONNECTION:
      'Write a short LinkedIn connection request (max 280 characters). Reference one specific detail about their role or company. Do not pitch anything.',
    FOLLOW_UP:
      'Write a polite follow-up message (4–6 sentences). Reference our previous outreach, add one new piece of value, and end with a low-friction CTA.',
    SALES_PITCH:
      `Write a personalized sales message about ${product} (5–8 sentences). Open with a relevant observation about their company or role, articulate one clear benefit, and close with a soft meeting CTA.`,
    CUSTOM: 'Write the requested message using the provided template.',
  };

  const tpl =
    input.promptTemplate?.trim() ||
    [
      `You are a senior sales copywriter. Tone: ${tone}.`,
      `Recipient: ${fullName}${jobTitle ? `, ${jobTitle}` : ''}${company ? ` at ${company}` : ''}.`,
      bio ? `About them: ${bio}` : '',
      kindInstruction[input.kind],
      'Avoid generic phrases like "I hope this finds you well". Make it sound human.',
    ]
      .filter(Boolean)
      .join('\n');

  return tpl;
}

// ===== Real OpenAI call =====
async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write personalized social-media outreach messages.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? '';
}

// ===== Mock generator (high quality) =====
function mockGenerate(input: GenerateInput): string {
  const { fullName, company, jobTitle, bio } = input.lead;
  const first = fullName.split(' ')[0] || 'there';
  const co = company || 'your company';
  const role = jobTitle || 'your role';
  const hint = bio ? bio.split('.')[0] : `the work you're doing at ${co}`;
  const product = input.product?.trim() || 'a tool that helps sales teams personalize outreach at scale';

  switch (input.kind) {
    case 'CONNECTION':
      return `Hi ${first} — came across your profile after reading about ${co}. The way you're approaching ${role.toLowerCase()} caught my eye, particularly ${hint.toLowerCase()}. Would love to connect and follow your work.`;

    case 'FOLLOW_UP':
      return `Hi ${first},\n\nWanted to circle back on my note from last week. Since then I've been thinking about how teams like yours at ${co} usually handle outbound personalization — most of the people I talk to in ${role.toLowerCase()} say the same thing: it's the part that doesn't scale.\n\nWe just shipped a feature that auto-tailors the first three touches off a single LinkedIn URL. Happy to send a 90-second Loom — only if useful, no pressure either way.\n\n— Best`;

    case 'SALES_PITCH':
      return `Hi ${first},\n\nQuick note — your post on ${hint.toLowerCase()} resonated, especially the bit about pipeline being a quality problem more than a volume one. That's exactly the gap we built ${product} for.\n\nIn short: we help ${role.toLowerCase()}s like yours at ${co} cut research time per lead from 12 minutes to under 60 seconds, with messages that actually sound like you wrote them. One ${role.toLowerCase()} in our beta booked 14 meetings off her first 200-lead batch.\n\nOpen to a 15-min call next Tuesday or Thursday? Happy to share the playbook even if we never work together.\n\n— Cheers`;

    case 'CUSTOM':
    default:
      return `Hi ${first}, just a quick message about ${product}. Let me know if you'd like to learn more about how we could help at ${co}.`;
  }
}

export async function generateMessage(input: GenerateInput): Promise<GenerateResult> {
  const prompt = buildPrompt(input);
  if (process.env.OPENAI_API_KEY) {
    try {
      const output = await callOpenAI(prompt);
      return { output, prompt, model: 'gpt-4o-mini' };
    } catch (e) {
      console.error('OpenAI failed, falling back to mock:', e);
      return { output: mockGenerate(input), prompt, model: 'mock-gpt (fallback)' };
    }
  }
  return { output: mockGenerate(input), prompt, model: 'mock-gpt' };
}

// Seed prompts shipped with the app
export const SEED_PROMPTS: Array<{ name: string; kind: MessageKind; body: string }> = [
  {
    name: 'Friendly first touch',
    kind: 'CONNECTION',
    body: 'Tone: warm but professional. Reference one specific detail from their profile. Never pitch. Max 280 chars.',
  },
  {
    name: 'Mutual-interest connect',
    kind: 'CONNECTION',
    body: 'Open with shared interest or industry observation. Avoid "saw you on LinkedIn". Keep under 280 chars.',
  },
  {
    name: 'Soft follow-up (value add)',
    kind: 'FOLLOW_UP',
    body: 'Reference previous touch in one line. Add one new piece of value (insight, article, stat). End with low-friction CTA.',
  },
  {
    name: 'Breakup follow-up',
    kind: 'FOLLOW_UP',
    body: 'Polite final follow-up. Acknowledge they might not be a fit right now. Keep door open. 3–4 sentences.',
  },
  {
    name: 'Problem-first sales pitch',
    kind: 'SALES_PITCH',
    body: 'Open with the specific problem their role typically faces. Quantify the impact. One sentence on solution. CTA for short call.',
  },
  {
    name: 'Case-study sales pitch',
    kind: 'SALES_PITCH',
    body: 'Lead with a similar customer outcome (anonymized). Tie it to their likely goal. Offer to share the case study.',
  },
];
