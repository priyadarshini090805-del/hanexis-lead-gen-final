import OpenAI from 'openai';

const client = new OpenAI({
  apiKey:
    process.env.OPENROUTER_API_KEY,

  baseURL:
    'https://openrouter.ai/api/v1',
});

export const SEED_PROMPTS = [
  {
    name:
      'Professional introduction',

    kind:
      'CONNECTION',

    body:
      'Write a concise professional networking introduction.',
  },

  {
    name:
      'Friendly follow-up',

    kind:
      'FOLLOW_UP',

    body:
      'Write a friendly follow-up outreach message.',
  },

  {
    name:
      'Personalized sales pitch',

    kind:
      'SALES_PITCH',

    body:
      'Write a short personalized sales pitch.',
  },
];

type MessageKind =
  | 'CONNECTION'
  | 'FOLLOW_UP'
  | 'SALES_PITCH'
  | 'CUSTOM';

type AiTone =
  | 'FRIENDLY'
  | 'PROFESSIONAL';

interface GenerateMessageInput {
  kind: MessageKind;

  tone?: AiTone;

  product?: string;

  promptTemplate?: string;

  lead: {
    fullName: string;

    company?: string;

    jobTitle?: string;

    bio?: string;
  };
}

export async function generateMessage({
  kind,
  tone = 'PROFESSIONAL',
  product,
  promptTemplate,
  lead,
}: GenerateMessageInput) {
  const prompt = `
You are an expert B2B outbound sales assistant.

Write a highly personalized outreach message.

RULES:
- Human sounding
- Short and concise
- Natural language
- No emojis
- No markdown
- No fake hype
- Under 120 words

Tone:
${tone}

Message Type:
${kind}

Lead:
Name: ${lead.fullName}
Company: ${lead.company ?? 'Unknown'}
Role: ${lead.jobTitle ?? 'Unknown'}
Bio: ${lead.bio ?? 'No additional context'}

Product:
${product ?? 'Not provided'}

Extra Instructions:
${promptTemplate ?? 'None'}
`;

  const completion =
    await client.chat.completions.create(
      {
        model:
          'openai/gpt-3.5-turbo',

        messages: [
          {
            role:
              'user',

            content:
              prompt,
          },
        ],
      }
    );

  const output =
    completion.choices[0]
      ?.message?.content ??
    'Unable to generate response';

  return {
    prompt,

    output,

    model:
      'openrouter-gpt-3.5',
  };
}