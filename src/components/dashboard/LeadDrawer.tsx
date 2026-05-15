'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const STATUSES = [
  'NEW',
  'CONTACTED',
  'RESPONDED',
  'CONVERTED',
  'ARCHIVED',
] as const;

const KINDS = [
  {
    v: 'CONNECTION',
    label: 'Connection request',
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
,
] as const;

export function LeadDrawer({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { upsertLead } = useLeadsStore();

  const [lead, setLead] =
    useState<LeadView | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [kind, setKind] =
    useState<(typeof KINDS)[number]['v']>(
      'CONNECTION'
    );

  const [tone, setTone] =
    useState<(typeof TONES)[number]>(
      'professional'
    );

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
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();

      setLead(data.lead);
    } catch {
      toast.error('Failed to load lead');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!lead) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          fullName: lead.fullName,
          email: lead.email,
          company: lead.company,
          jobTitle: lead.jobTitle,
          bio: lead.bio,
          linkedinUrl: lead.linkedinUrl,
          instagramUrl: lead.instagramUrl,
          status: lead.status,
          score: lead.score,
          notes: lead.notes,
          tags: lead.tags.map(
            (t) => t.label
          ),
        }),
      });

      if (!res.ok)
        throw new Error();

      const data = await res.json();

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
      const res = await fetch(
        '/api/ai/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            kind,
            leadId: lead.id,
            tone,
            product,
          }),
        }
      );

      if (!res.ok)
        throw new Error();

      const data = await res.json();

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 28,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="ml-auto h-full w-full max-w-3xl overflow-y-auto border-l border-gray-200 bg-white"
      >
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
          <div className="flex items-start justify-between px-6 py-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading
                    ? 'Loading...'
                    : lead?.fullName}
                </h2>

                <div
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                    leadTemperature ===
                      'Hot' &&
                      'bg-red-100 text-red-700',
                    leadTemperature ===
                      'Warm' &&
                      'bg-amber-100 text-amber-700',
                    leadTemperature ===
                      'Cold' &&
                      'bg-slate-100 text-slate-700'
                  )}
                >
                  {leadTemperature}
                </div>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                AI relationship workspace
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? 'Saving...'
                  : 'Save changes'}
              </button>

              <button
                onClick={onClose}
                className="btn-ghost"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {loading || !lead ? (
          <div className="space-y-3 p-6">
            <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-6 p-6">

            {/* Intelligence Layer */}

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

            {/* Lead Profile */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lead profile
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Centralized lead identity
                    and engagement context
                  </p>
                </div>

                <BadgeCheck className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Field label="Full name">
                  <input
                    className="input-default"
                    value={lead.fullName}
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
                      lead.email ?? ''
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
                      lead.company ?? ''
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
                      lead.jobTitle ?? ''
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
                    <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

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
                    <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

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

              <div className="mt-4">
                <Field label="Lead context">
                  <textarea
                    rows={4}
                    className="input-default resize-none"
                    value={lead.bio ?? ''}
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

            {/* AI Workspace */}

            <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">

              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI outreach generator
                  </h3>

                  <p className="text-sm text-gray-500">
                    Generate personalized
                    outbound messaging
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">

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
                    {KINDS.map((k) => (
                      <option
                        key={k.v}
                        value={k.v}
                      >
                        {k.label}
                      </option>
                    ))}
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
                    {TONES.map((t) => (
                      <option key={t}>
                        {t}
                      </option>
                    ))}
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

              <button
                onClick={generate}
                disabled={generating}
                className="btn-primary mt-5"
              >
                <Wand2 className="h-4 w-4" />

                {generating
                  ? 'Generating message...'
                  : 'Generate AI message'}
              </button>

              <AnimatePresence>
                {aiOutput && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Generated output
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          Context-aware
                          personalized
                          outreach
                        </div>
                      </div>

                      <button
                        onClick={
                          copyOutput
                        }
                        className="btn-secondary"
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

                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                      {aiOutput}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {title}
        </div>

        <Icon className="h-4 w-4 text-gray-400" />
      </div>

      <div className="mt-3 text-2xl font-bold text-gray-900">
        {value}
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>

      {children}
    </label>
  );
}