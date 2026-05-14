import { AiTone, MessageKind, OutreachChannel } from '@prisma/client';

export interface GenerateInput {
  kind: MessageKind;

  channel?: OutreachChannel;

  tone?: AiTone;

  product?: string | null;

  campaignGoal?: string | null;

  lead: {
    fullName: string;

    company?: string | null;

    companyWebsite?: string | null;

    jobTitle?: string | null;

    bio?: string | null;

    aiSummary?: string | null;

    engagementScore?: number | null;
  };

  promptTemplate?: string | null;
}

export interface GenerateResult {
  output: string;

  prompt: string;

  model: string;

  personalizationScore: number;

  reasoning: string[];
}

const toneProfiles: Record<AiTone, string> = {
  PROFESSIONAL:
    'Professional, concise, executive-friendly, insight-driven.',

  FRIENDLY:
    'Warm, approachable, human, conversational.',

  DIRECT:
    'Direct, clear, low fluff, action-oriented.',

  CONSULTATIVE:
    'Consultative, thoughtful, strategic, value-first.',
};

function detectLeadSignals(input: GenerateInput): string[] {
  const signals: string[] = [];

  const lead = input.lead;

  if (lead.jobTitle?.toLowerCase().includes('founder')) {
    signals.push(
      'Founder persona detected — prioritize speed, leverage, and growth.'
    );
  }

  if (lead.jobTitle?.toLowerCase().includes('marketing')) {
    signals.push(
      'Marketing persona detected — focus on conversion and engagement.'
    );
  }

  if (lead.jobTitle?.toLowerCase().includes('sales')) {
    signals.push(
      'Sales persona detected — focus on pipeline efficiency.'
    );
  }

  if (lead.bio?.toLowerCase().includes('ai')) {
    signals.push(
      'Lead is AI-aware — avoid generic AI buzzwords.'
    );
  }

  if ((lead.engagementScore ?? 0) > 70) {
    signals.push(
      'High engagement lead — outreach can be more direct.'
    );
  }

  return signals;
}

function calculatePersonalizationScore(
  input: GenerateInput
): number {
  let score = 40;

  if (input.lead.company) score += 10;

  if (input.lead.jobTitle) score += 15;

  if (input.lead.bio) score += 20;

  if (input.lead.aiSummary) score += 10;

  if (input.promptTemplate) score += 5;

  return Math.min(score, 100);
}

function buildPrompt(input: GenerateInput): {
  prompt: string;

  reasoning: string[];
} {
  const tone =
    toneProfiles[input.tone ?? 'PROFESSIONAL'];

  const personalizationSignals =
    detectLeadSignals(input);

  const lead = input.lead;

  const firstName =
    lead.fullName.split(' ')[0] || 'there';

  const channel =
    input.channel ?? 'EMAIL';

  const product =
    input.product ??
    'an AI-powered outreach workflow platform';

  const campaignGoal =
    input.campaignGoal ??
    'start a meaningful business conversation';

  const instructions: Record<MessageKind, string> = {
    CONNECTION:
      `
Write a highly personalized connection request.

Constraints:
- under 280 characters
- reference one believable contextual detail
- avoid sounding automated
- avoid corporate buzzwords
- no hard selling
      `,

    FOLLOW_UP:
      `
Write a smart follow-up message.

Constraints:
- acknowledge previous touch naturally
- introduce one new insight
- avoid sounding pushy
- conversational pacing
- end with low-friction CTA
      `,

    SALES_PITCH:
      `
Write a strategic outbound sales message.

Requirements:
- identify likely operational pain point
- connect product to business outcome
- use concise persuasion
- avoid sounding spammy
- CTA should feel consultative, not aggressive
      `,

    RE_ENGAGEMENT:
      `
Write a re-engagement message for a cold lead.

Requirements:
- lightweight tone
- curiosity-driven
- acknowledge timing/context
- no guilt language
      `,

    CUSTOM:
      `
Follow the custom instructions provided by the user.
      `,
  };

  const systemContext = `
You are Hanexis AI.

You generate elite-level outbound outreach messages for modern sales and growth teams.

Your outputs should:
- feel human-written
- avoid robotic phrasing
- avoid exaggerated hype
- sound context-aware
- optimize for response rate
- balance brevity with personalization

Tone profile:
${tone}

Campaign goal:
${campaignGoal}

Target channel:
${channel}

Lead details:
Name: ${lead.fullName}
Role: ${lead.jobTitle ?? 'Unknown'}
Company: ${lead.company ?? 'Unknown'}
Bio: ${lead.bio ?? 'Unavailable'}

Lead intelligence:
${personalizationSignals.join('\n')}

Offer/Product:
${product}

Task:
${instructions[input.kind]}
  `;

  const finalPrompt =
    input.promptTemplate?.trim() || systemContext;

  return {
    prompt: finalPrompt,

    reasoning: personalizationSignals,
  };
}

async function callOpenAI(
  prompt: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!;

  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: 'gpt-4o-mini',

        temperature: 0.8,

        max_tokens: 450,

        messages: [
          {
            role: 'system',

            content:
              'You are an elite outbound strategist.',
          },

          {
            role: 'user',

            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `OpenAI request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return (
    data.choices?.[0]?.message?.content?.trim() ?? ''
  );
}

function fallbackGenerator(
  input: GenerateInput
): string {
  const firstName =
    input.lead.fullName.split(' ')[0];

  const company =
    input.lead.company ?? 'your company';

  const role =
    input.lead.jobTitle ?? 'your role';

  switch (input.kind) {
    case 'CONNECTION':
      return `
Hi ${firstName} — came across your work at ${company} and really liked your perspective around ${role.toLowerCase()}.

Would love to connect and follow what you're building.
      `.trim();

    case 'FOLLOW_UP':
      return `
Hi ${firstName},

Wanted to briefly follow up on my earlier message.

A lot of teams in ${role.toLowerCase()} are currently struggling with personalization at scale, so I thought this might actually be relevant for your workflow.

Happy to share a few ideas if useful.
      `.trim();

    case 'SALES_PITCH':
      return `
Hi ${firstName},

We built Hanexis to help growth and outbound teams reduce manual prospecting work while increasing personalization quality.

Teams using similar workflows are seeing significantly faster lead research and better response quality.

Open to a quick conversation next week?
      `.trim();

    default:
      return `
Hi ${firstName},

Just wanted to reach out and start a conversation around potential collaboration opportunities.
      `.trim();
  }
}

export async function generateMessage(
  input: GenerateInput
): Promise<GenerateResult> {
  const { prompt, reasoning } =
    buildPrompt(input);

  const personalizationScore =
    calculatePersonalizationScore(input);

  if (process.env.OPENAI_API_KEY) {
    try {
      const output =
        await callOpenAI(prompt);

      return {
        output,

        prompt,

        reasoning,

        personalizationScore,

        model: 'hanexis-ai-v2',
      };
    } catch (error) {
      console.error(
        'AI provider failed. Falling back locally.',
        error
      );
    }
  }

  return {
    output: fallbackGenerator(input),

    prompt,

    reasoning,

    personalizationScore,

    model: 'hanexis-local-fallback',
  };
}

export const SEED_PROMPTS = [
  {
    name: 'Founder-first outreach',

    kind: 'CONNECTION',

    tone: 'CONSULTATIVE',

    body:
      'Focus on leverage, growth bottlenecks, and operational efficiency.',
  },

  {
    name: 'Consultative follow-up',

    kind: 'FOLLOW_UP',

    tone: 'PROFESSIONAL',

    body:
      'Avoid pressure. Introduce one useful insight naturally.',
  },

  {
    name: 'Strategic outbound pitch',

    kind: 'SALES_PITCH',

    tone: 'DIRECT',

    body:
      'Lead with measurable business value and operational outcomes.',
  },
];