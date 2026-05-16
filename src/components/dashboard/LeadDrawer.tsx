'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  X,
  Sparkles,
  Linkedin,
  Instagram,
  Save,
  Wand2,
  Copy,
  Check,
  Brain,
  Activity,
  Clock3,
  TrendingUp,
  BadgeCheck,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  useLeadsStore,
  type LeadView,
} from '@/stores/useLeadsStore';

import {
  cn,
  timeAgo,
} from '@/lib/utils';

const KINDS = [
  {
    v: 'CONNECTION',
    label:
      'Connection request',
  },

  {
    v: 'FOLLOW_UP',
    label: 'Follow-up',
  },

  {
    v: 'SALES_PITCH',
    label: 'Sales pitch',
  },
] as const;

const TONES = [
  'friendly',
  'professional',
] as const;

export function LeadDrawer({
  id,
  onClose,
}: {
  id: string;

  onClose: () => void;
}) {
  const { upsertLead } =
    useLeadsStore();

  const [lead, setLead] =
    useState<LeadView | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [kind, setKind] =
    useState<
      (typeof KINDS)[number]['v']
    >('CONNECTION');

  const [tone, setTone] =
    useState<
      (typeof TONES)[number]
    >('professional');

  const [product, setProduct] =
    useState('');

  const [aiOutput, setAiOutput] =
    useState('');

  const [generating, setGenerating] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    void fetchLead();
  }, [id]);

  async function fetchLead() {
    setLoading(true);

    try {
      const res =
        await fetch(
          `/api/leads/${id}`
        );

      const data =
        await res.json();

      setLead(data.lead);
    } catch {
      toast.error(
        'Failed to load lead'
      );
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!lead) return;

    setSaving(true);

    try {
      const res =
        await fetch(
          `/api/leads/${id}`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              fullName:
                lead.fullName,

              email:
                lead.email,

              company:
                lead.company,

              jobTitle:
                lead.jobTitle,

              bio: lead.bio,

              linkedinUrl:
                lead.linkedinUrl,

              instagramUrl:
                lead.instagramUrl,

              status:
                lead.status,

              score:
                lead.score,

              notes:
                lead.notes,

              tags:
                lead.tags.map(
                  (t) =>
                    t.label
                ),
            }),
          }
        );

      if (!res.ok)
        throw new Error();

      const data =
        await res.json();

      upsertLead(data.lead);

      toast.success(
        'Lead updated successfully'
      );
    } catch {
      toast.error(
        'Unable to save changes'
      );
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    if (!lead) return;

    setGenerating(true);

    setAiOutput('');

    try {
      const res =
        await fetch(
          '/api/ai/generate',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              kind,

              tone,

              product,

              ephemeralLead:
                {
                  fullName:
                    lead.fullName,

                  company:
                    lead.company ??
                    '',

                  jobTitle:
                    lead.jobTitle ??
                    '',

                  bio:
                    lead.bio ??
                    '',
                },
            }),
          }
        );

      if (!res.ok)
        throw new Error();

      const data =
        await res.json();

      setAiOutput(
        data.message.output
      );
    } catch {
      toast.error(
        'AI generation failed'
      );
    } finally {
      setGenerating(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(
      aiOutput
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  const leadTemperature =
    useMemo(() => {
      if (!lead) return 'Cold';

      if (lead.score >= 80)
        return 'Hot';

      if (lead.score >= 50)
        return 'Warm';

      return 'Cold';
    }, [lead]);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        fixed inset-0 z-50
        bg-black/40
        backdrop-blur-xl
      "
      onClick={onClose}
    >

      {/* Drawer */}

      <motion.aside
        initial={{
          x: '100%',
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: '100%',
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 28,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative ml-auto
          h-full w-full
          max-w-[960px]
          overflow-y-auto
          border-l border-white/30
          bg-[#f8fafc]/90
          shadow-[0_20px_80px_rgba(15,23,42,0.25)]
          backdrop-blur-2xl
        "
      >

        {/* Ambient */}

        <div
          className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
          "
        >

          <div
            className="
              absolute right-[-120px]
              top-[-120px]
              h-[360px] w-[360px]
              rounded-full
              bg-violet-300/20
              blur-3xl
            "
          />

          <div
            className="
              absolute bottom-[-120px]
              left-[-120px]
              h-[320px] w-[320px]
              rounded-full
              bg-cyan-300/20
              blur-3xl
            "
          />
        </div>

        <div className="relative z-10">

          {/* Header */}

          <div
            className="
              sticky top-0 z-20
              border-b border-white/40
              bg-white/60
              backdrop-blur-2xl
            "
          >

            <div
              className="
                flex items-start
                justify-between
                px-8 py-6
              "
            >

              <div>

                <div
                  className="
                    flex items-center
                    gap-3
                  "
                >

                  <h2
                    className="
                      text-3xl
                      font-semibold
                      tracking-tight
                      text-neutral-950
                    "
                  >
                    {loading
                      ? 'Loading...'
                      : lead?.fullName}
                  </h2>

                  <div
                    className={cn(
                      `
                        rounded-full
                        px-3 py-1
                        text-xs
                        font-medium
                      `,

                      leadTemperature ===
                        'Hot' &&
                        `
                          bg-red-100
                          text-red-700
                        `,

                      leadTemperature ===
                        'Warm' &&
                        `
                          bg-amber-100
                          text-amber-700
                        `,

                      leadTemperature ===
                        'Cold' &&
                        `
                          bg-slate-100
                          text-slate-700
                        `
                    )}
                  >
                    {
                      leadTemperature
                    }
                  </div>
                </div>

                <p
                  className="
                    mt-2 text-sm
                    text-neutral-500
                  "
                >
                  Intelligent
                  relationship
                  management workspace
                  with AI-assisted
                  engagement.
                </p>
              </div>

              <div
                className="
                  flex items-center
                  gap-3
                "
              >

                <motion.button
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={save}
                  disabled={saving}
                  className="
                    flex items-center
                    gap-2 rounded-2xl
                    bg-neutral-950
                    px-5 py-3
                    text-sm
                    font-medium
                    text-white
                    shadow-lg
                  "
                >

                  <Save className="h-4 w-4" />

                  {saving
                    ? 'Saving...'
                    : 'Save'}
                </motion.button>

                <button
                  onClick={onClose}
                  className="
                    flex h-12 w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border border-white/50
                    bg-white/70
                    backdrop-blur-xl
                  "
                >
                  <X className="h-5 w-5 text-neutral-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}

          {loading || !lead ? (
            <div className="space-y-4 p-8">

              <div className="h-20 rounded-3xl bg-white animate-pulse" />

              <div className="h-52 rounded-3xl bg-white animate-pulse" />

              <div className="h-72 rounded-3xl bg-white animate-pulse" />
            </div>
          ) : (
            <div className="space-y-7 p-8">

              {/* Metrics */}

              <section className="grid gap-4 md:grid-cols-4">

                <InsightCard
                  icon={TrendingUp}
                  title="Lead Score"
                  value={`${lead.score}/100`}
                />

                <InsightCard
                  icon={Activity}
                  title="Status"
                  value={lead.status}
                />

                <InsightCard
                  icon={Brain}
                  title="AI Tone"
                  value={tone}
                />

                <InsightCard
                  icon={Clock3}
                  title="Last Update"
                  value={timeAgo(
                    lead.updatedAt
                  )}
                />
              </section>

              {/* Profile */}

              <section
                className="
                  rounded-[32px]
                  border border-white/50
                  bg-white/70
                  p-6
                  shadow-[0_10px_40px_rgba(15,23,42,0.06)]
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    mb-6 flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <h3
                      className="
                        text-xl
                        font-semibold
                        text-neutral-950
                      "
                    >
                      Lead profile
                    </h3>

                    <p
                      className="
                        mt-1 text-sm
                        text-neutral-500
                      "
                    >
                      Relationship and
                      engagement context
                    </p>
                  </div>

                  <BadgeCheck
                    className="
                      h-5 w-5
                      text-emerald-500
                    "
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field label="Full name">
                    <input
                      className="input-default"
                      value={
                        lead.fullName
                      }
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          fullName:
                            e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Email">
                    <input
                      className="input-default"
                      value={
                        lead.email ??
                        ''
                      }
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          email:
                            e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Company">
                    <input
                      className="input-default"
                      value={
                        lead.company ??
                        ''
                      }
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          company:
                            e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="Job title">
                    <input
                      className="input-default"
                      value={
                        lead.jobTitle ??
                        ''
                      }
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          jobTitle:
                            e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field label="LinkedIn">
                    <div className="relative">

                      <Linkedin
                        className="
                          absolute left-3
                          top-1/2 h-4 w-4
                          -translate-y-1/2
                          text-neutral-400
                        "
                      />

                      <input
                        className="input-default pl-10"
                        value={
                          lead.linkedinUrl ??
                          ''
                        }
                        onChange={(e) =>
                          setLead({
                            ...lead,
                            linkedinUrl:
                              e.target.value,
                          })
                        }
                      />
                    </div>
                  </Field>

                  <Field label="Instagram">
                    <div className="relative">

                      <Instagram
                        className="
                          absolute left-3
                          top-1/2 h-4 w-4
                          -translate-y-1/2
                          text-neutral-400
                        "
                      />

                      <input
                        className="input-default pl-10"
                        value={
                          lead.instagramUrl ??
                          ''
                        }
                        onChange={(e) =>
                          setLead({
                            ...lead,
                            instagramUrl:
                              e.target.value,
                          })
                        }
                      />
                    </div>
                  </Field>
                </div>

                <div className="mt-5">

                  <Field label="Lead context">
                    <textarea
                      rows={5}
                      className="input-default resize-none"
                      value={
                        lead.bio ?? ''
                      }
                      onChange={(e) =>
                        setLead({
                          ...lead,
                          bio:
                            e.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* AI */}

              <section
                className="
                  relative overflow-hidden
                  rounded-[32px]
                  border border-white/50
                  bg-gradient-to-br
                  from-violet-50/80
                  via-white/80
                  to-cyan-50/70
                  p-6
                  shadow-[0_10px_50px_rgba(15,23,42,0.08)]
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute right-[-80px]
                    top-[-80px]
                    h-64 w-64
                    rounded-full
                    bg-violet-300/20
                    blur-3xl
                  "
                />

                <div className="relative z-10">

                  <div
                    className="
                      mb-6 flex
                      items-center gap-3
                    "
                  >

                    <div
                      className="
                        flex h-12 w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white
                        shadow-sm
                      "
                    >

                      <Sparkles
                        className="
                          h-5 w-5
                          text-violet-600
                        "
                      />
                    </div>

                    <div>

                      <h3
                        className="
                          text-xl
                          font-semibold
                          text-neutral-950
                        "
                      >
                        AI outreach
                        generator
                      </h3>

                      <p
                        className="
                          text-sm
                          text-neutral-500
                        "
                      >
                        Generate intelligent
                        personalized outreach
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">

                    <Field label="Message type">
                      <select
                        className="input-default"
                        value={kind}
                        onChange={(e) =>
                          setKind(
                            e.target
                              .value as any
                          )
                        }
                      >

                        {KINDS.map(
                          (k) => (
                            <option
                              key={k.v}
                              value={k.v}
                            >
                              {k.label}
                            </option>
                          )
                        )}
                      </select>
                    </Field>

                    <Field label="Communication tone">
                      <select
                        className="input-default"
                        value={tone}
                        onChange={(e) =>
                          setTone(
                            e.target
                              .value as any
                          )
                        }
                      >

                        {TONES.map(
                          (t) => (
                            <option
                              key={t}
                            >
                              {t}
                            </option>
                          )
                        )}
                      </select>
                    </Field>

                    <Field label="Product context">
                      <input
                        className="input-default"
                        value={product}
                        onChange={(e) =>
                          setProduct(
                            e.target.value
                          )
                        }
                        placeholder="AI CRM platform"
                      />
                    </Field>
                  </div>

                  <motion.button
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={generate}
                    disabled={
                      generating
                    }
                    className="
                      mt-6 flex
                      items-center gap-2
                      rounded-2xl
                      bg-neutral-950
                      px-5 py-3
                      text-sm
                      font-medium
                      text-white
                      shadow-lg
                    "
                  >

                    <Wand2 className="h-4 w-4" />

                    {generating
                      ? 'Generating...'
                      : 'Generate AI message'}
                  </motion.button>

                  <AnimatePresence>

                    {aiOutput && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="
                          mt-6 rounded-[28px]
                          border border-white/50
                          bg-white/80
                          p-6
                          shadow-sm
                          backdrop-blur-2xl
                        "
                      >

                        <div
                          className="
                            mb-5 flex
                            items-center
                            justify-between
                          "
                        >

                          <div>

                            <div
                              className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-neutral-500
                              "
                            >
                              Generated output
                            </div>

                            <div
                              className="
                                mt-1 text-sm
                                text-neutral-500
                              "
                            >
                              Personalized AI
                              outreach response
                            </div>
                          </div>

                          <button
                            onClick={
                              copyOutput
                            }
                            className="
                              flex items-center
                              gap-2 rounded-2xl
                              border border-white/50
                              bg-white/80
                              px-4 py-2
                              text-sm
                              font-medium
                              text-neutral-700
                            "
                          >

                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}

                            {copied
                              ? 'Copied'
                              : 'Copy'}
                          </button>
                        </div>

                        <pre
                          className="
                            whitespace-pre-wrap
                            font-sans text-sm
                            leading-7
                            text-neutral-700
                          "
                        >
                          {aiOutput}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
}: {
  icon: any;

  title: string;

  value: string | number;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        relative overflow-hidden
        rounded-[28px]
        border border-white/50
        bg-white/70
        p-5
        shadow-sm
        backdrop-blur-2xl
      "
    >

      <div
        className="
          absolute right-0
          top-0 h-24 w-24
          rounded-full
          bg-violet-200/20
          blur-2xl
        "
      />

      <div className="relative z-10">

        <div
          className="
            flex items-center
            justify-between
          "
        >

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            {title}
          </div>

          <div
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-2xl
              bg-neutral-100
            "
          >

            <Icon
              className="
                h-4 w-4
                text-neutral-700
              "
            />
          </div>
        </div>

        <div
          className="
            mt-5 text-3xl
            font-semibold
            tracking-tight
            text-neutral-950
          "
        >
          {value}
        </div>
      </div>
    </motion.div>
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

      <span
        className="
          mb-2 block
          text-xs font-semibold
          uppercase tracking-wide
          text-neutral-500
        "
      >
        {label}
      </span>

      {children}
    </label>
  );
}