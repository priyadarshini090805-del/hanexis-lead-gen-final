'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import toast from 'react-hot-toast';

import {
  Wand2,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

import {
  cn,
  timeAgo,
} from '@/lib/utils';

const KINDS = [
  {
    v: 'CONNECTION',
    label:
      'Connection request',

    desc:
      'Short introductory outreach',
  },

  {
    v: 'FOLLOW_UP',
    label: 'Follow-up',

    desc:
      'Second-touch conversation',
  },

  {
    v: 'SALES_PITCH',
    label: 'Sales pitch',

    desc:
      'Full personalized pitch',
  },
] as const;

const TONES = [
  'FRIENDLY',
  'PROFESSIONAL',
  'CASUAL',
  'ENTHUSIASTIC',
] as const;

interface MessageItem {
  id: string;

  kind:
    | 'CONNECTION'
    | 'FOLLOW_UP'
    | 'SALES_PITCH'
    | 'CUSTOM';

  output: string;

  model: string;

  createdAt: string;

  lead?: {
    fullName: string;

    company: string | null;
  } | null;
}

export default function AIMessagesPage() {
  const [kind, setKind] =
    useState<
      (typeof KINDS)[number]['v']
    >('CONNECTION');

  const [tone, setTone] =
    useState<
      (typeof TONES)[number]
    >('PROFESSIONAL');

  const [product, setProduct] =
    useState('');

  const [form, setForm] =
    useState({
      fullName: '',
      company: '',
      jobTitle: '',
      bio: '',
    });

  const [output, setOutput] =
    useState('');

  const [generating, setGenerating] =
    useState(false);

  const [history, setHistory] =
    useState<MessageItem[]>([]);

  const [copiedId, setCopiedId] =
    useState<string | null>(
      null
    );

  async function loadHistory() {
    try {
      const response =
        await fetch(
          '/api/ai/generate'
        );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setHistory(
        data.messages ?? []
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function generate() {
    if (!form.fullName.trim()) {
      toast.error(
        'Recipient name is required'
      );

      return;
    }

    try {
      setGenerating(true);

      setOutput('');

      const response =
        await fetch(
          '/api/ai/generate',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              {
                kind,
                tone,
                product,

                ephemeralLead:
                  form,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Generation failed'
        );
      }

      setOutput(
        data.message.output
      );

      toast.success(
        'Message generated'
      );

      await loadHistory();
    } catch (err) {
      console.error(err);

      toast.error(
        'Unable to generate message'
      );
    } finally {
      setGenerating(false);
    }
  }

  function copy(
    text: string,
    id: string
  ) {
    navigator.clipboard.writeText(
      text
    );

    setCopiedId(id);

    toast.success(
      'Copied to clipboard'
    );

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <div
          className="
            text-sm
            text-neutral-500
          "
        >
          Outreach workspace
        </div>

        <h1
          className="
            mt-1 text-4xl
            font-semibold
            tracking-tight
            text-neutral-950
          "
        >
          Generate outreach
        </h1>

        <p
          className="
            mt-4 max-w-2xl
            text-base
            leading-8
            text-neutral-600
          "
        >
          Create personalized
          outbound messages
          using prospect details,
          company context,
          and communication tone.
        </p>
      </div>

      {/* Layout */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[1.3fr_0.7fr]
        "
      >

        {/* Generator */}

        <div
          className="
            rounded-[32px]
            border border-neutral-200
            bg-white
            p-7
          "
        >

          {/* Top */}

          <div
            className="
              flex items-center
              justify-between
            "
          >

            <div>

              <div
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Message composer
              </div>

              <h2
                className="
                  mt-1 text-2xl
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                New outreach draft
              </h2>
            </div>

            <div
              className="
                hidden items-center
                gap-2 rounded-full
                border border-neutral-200
                bg-neutral-50
                px-4 py-2
                text-sm
                text-neutral-600
                lg:flex
              "
            >
              <Sparkles className="h-4 w-4" />

              AI-assisted
            </div>
          </div>

          {/* Types */}

          <div
            className="
              mt-7 grid gap-3
              md:grid-cols-3
            "
          >

            {KINDS.map(
              (item) => (
                <button
                  key={item.v}
                  onClick={() =>
                    setKind(
                      item.v
                    )
                  }
                  className={cn(
                    `
                      rounded-3xl
                      border p-5
                      text-left
                      transition-all
                    `,

                    kind === item.v
                      ? `
                        border-neutral-900
                        bg-neutral-900
                        text-white
                      `
                      : `
                        border-neutral-200
                        bg-neutral-50
                        hover:border-neutral-300
                        hover:bg-white
                      `
                  )}
                >

                  <div
                    className="
                      text-base
                      font-medium
                    "
                  >
                    {item.label}
                  </div>

                  <div
                    className={cn(
                      `
                        mt-2 text-sm
                        leading-6
                      `,

                      kind ===
                        item.v
                        ? `
                          text-neutral-300
                        `
                        : `
                          text-neutral-500
                        `
                    )}
                  >
                    {item.desc}
                  </div>
                </button>
              )
            )}
          </div>

          {/* Form */}

          <div
            className="
              mt-7 grid gap-5
              md:grid-cols-2
            "
          >

            <Field label="Recipient name">

              <input
                className={
                  inputClass
                }
                value={
                  form.fullName
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    fullName:
                      e.target
                        .value,
                  })
                }
                placeholder="Asha Patel"
              />
            </Field>

            <Field label="Company">

              <input
                className={
                  inputClass
                }
                value={
                  form.company
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    company:
                      e.target
                        .value,
                  })
                }
                placeholder="Acme Inc."
              />
            </Field>

            <Field label="Job title">

              <input
                className={
                  inputClass
                }
                value={
                  form.jobTitle
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    jobTitle:
                      e.target
                        .value,
                  })
                }
                placeholder="Head of Growth"
              />
            </Field>

            <Field label="Tone">

              <select
                className={
                  inputClass
                }
                value={tone}
                onChange={(
                  e
                ) =>
                  setTone(
                    e.target
                      .value as any
                  )
                }
              >

                {TONES.map(
                  (
                    toneOption
                  ) => (
                    <option
                      key={
                        toneOption
                      }
                      value={
                        toneOption
                      }
                    >
                      {toneOption
                        .charAt(0) +
                        toneOption
                          .slice(1)
                          .toLowerCase()}
                    </option>
                  )
                )}
              </select>
            </Field>
          </div>

          {/* Product */}

          <div className="mt-5">

            <Field label="Offering">

              <input
                className={
                  inputClass
                }
                value={product}
                onChange={(
                  e
                ) =>
                  setProduct(
                    e.target
                      .value
                  )
                }
                placeholder="Lead generation platform for outbound teams"
              />
            </Field>
          </div>

          {/* Context */}

          <div className="mt-5">

            <Field label="Prospect context">

              <textarea
                rows={5}
                className={`
                  ${inputClass}
                  resize-none py-4
                `}
                value={
                  form.bio
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    bio: e.target
                      .value,
                  })
                }
                placeholder="Recent funding round, hiring activity, product launch, social posts, or other useful context..."
              />
            </Field>
          </div>

          {/* CTA */}

          <button
            onClick={generate}
            disabled={generating}
            className="
              mt-7 inline-flex
              h-12 items-center
              justify-center
              gap-2 rounded-2xl
              bg-neutral-950
              px-5
              text-sm font-medium
              text-white
              transition
              hover:bg-black
              disabled:opacity-60
            "
          >

            {generating ? (
              <Loader2
                className="
                  h-4 w-4
                  animate-spin
                "
              />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}

            {generating
              ? 'Generating draft...'
              : 'Generate message'}
          </button>

          {/* Loading */}

          {generating && (
            <div
              className="
                mt-7 h-44
                animate-pulse
                rounded-[28px]
                bg-neutral-100
              "
            />
          )}

          {/* Output */}

          <AnimatePresence>

            {output && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mt-7 rounded-[30px]
                  border border-neutral-200
                  bg-neutral-50
                  p-6
                "
              >

                <div
                  className="
                    mb-5 flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      rounded-full
                      border border-neutral-200
                      bg-white
                      px-4 py-2
                      text-xs
                      font-medium
                      uppercase
                      tracking-wide
                      text-neutral-700
                    "
                  >
                    {kind.replace(
                      '_',
                      ' '
                    )}
                  </div>

                  <button
                    onClick={() =>
                      copy(
                        output,
                        'live'
                      )
                    }
                    className="
                      inline-flex
                      items-center gap-2
                      rounded-2xl
                      border border-neutral-200
                      bg-white
                      px-4 py-2
                      text-sm
                      text-neutral-700
                      transition
                      hover:bg-neutral-100
                    "
                  >

                    {copiedId ===
                    'live' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}

                    {copiedId ===
                    'live'
                      ? 'Copied'
                      : 'Copy'}
                  </button>
                </div>

                <pre
                  className="
                    whitespace-pre-wrap
                    font-sans text-sm
                    leading-8
                    text-neutral-800
                  "
                >
                  {output}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History */}

        <div
          className="
            rounded-[32px]
            border border-neutral-200
            bg-white
            p-7
          "
        >

          <div>

            <div
              className="
                text-sm
                text-neutral-500
              "
            >
              History
            </div>

            <h2
              className="
                mt-1 text-2xl
                font-semibold
                tracking-tight
                text-neutral-950
              "
            >
              Recent drafts
            </h2>
          </div>

          {history.length ===
          0 ? (
            <div
              className="
                mt-6 rounded-3xl
                border border-dashed
                border-neutral-300
                bg-neutral-50
                p-6
              "
            >

              <p
                className="
                  text-sm
                  leading-7
                  text-neutral-500
                "
              >
                Generated messages
                will appear here once
                outreach drafts are
                created.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {history.map(
                (
                  message
                ) => (
                  <div
                    key={
                      message.id
                    }
                    className="
                      rounded-3xl
                      border border-neutral-200
                      bg-neutral-50
                      p-5
                    "
                  >

                    <div
                      className="
                        flex items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div
                        className="
                          rounded-full
                          border border-neutral-200
                          bg-white
                          px-3 py-1
                          text-xs
                          font-medium
                          text-neutral-700
                        "
                      >
                        {message.kind.replace(
                          '_',
                          ' '
                        )}
                      </div>

                      <button
                        onClick={() =>
                          copy(
                            message.output,
                            message.id
                          )
                        }
                        className="
                          rounded-xl
                          p-2
                          text-neutral-500
                          transition
                          hover:bg-white
                          hover:text-neutral-900
                        "
                      >

                        {copiedId ===
                        message.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <p
                      className="
                        mt-4 line-clamp-5
                        text-sm
                        leading-7
                        text-neutral-700
                      "
                    >
                      {message.output}
                    </p>

                    <div
                      className="
                        mt-5 flex
                        items-center
                        justify-between
                        text-xs
                        text-neutral-500
                      "
                    >

                      <span>
                        {message.lead
                          ?.fullName ??
                          'Manual draft'}
                      </span>

                      <span>
                        {timeAgo(
                          message.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;

  children: React.ReactNode;
}) {
  return (
    <label className="block">

      <div
        className="
          mb-2 text-sm
          font-medium
          text-neutral-700
        "
      >
        {label}
      </div>

      {children}
    </label>
  );
}

const inputClass = `
  h-12 w-full
  rounded-2xl
  border border-neutral-200
  bg-neutral-50
  px-4
  text-sm
  text-neutral-900
  outline-none
  transition
  placeholder:text-neutral-400
  focus:border-neutral-300
  focus:bg-white
`;