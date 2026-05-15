import {
  GoogleGenerativeAI,
} from '@google/generative-ai';

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

const model =
  genAI.getGenerativeModel({
    model:
      'gemini-1.5-flash',
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
  const systemPrompt = `
You are an expert B2B outbound sales assistant.

Generate highly personalized outreach messages.

Rules:
- Keep message concise
- Human sounding
- Natural language
- No hype
- No emojis
- No markdown
- No placeholders
- Keep under 120 words
- Tone: ${tone}

Message Type:
${kind}

Lead Details:
Name: ${lead.fullName}
Company: ${lead.company ?? 'Unknown'}
Role: ${lead.jobTitle ?? 'Unknown'}
Bio: ${lead.bio ?? 'No additional context'}

Product/Service:
${product ?? 'Not provided'}

Extra Instructions:
${promptTemplate ?? 'None'}
`;

  const result =
    await model.generateContent(
      systemPrompt
    );

  const response =
    await result.response;

  const output =
    response.text().trim();

  return {
    prompt:
      systemPrompt,

    output,

    model:
      'gemini-1.5-flash',
  };
}