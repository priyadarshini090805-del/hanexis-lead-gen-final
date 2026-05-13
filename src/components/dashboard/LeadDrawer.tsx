'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Linkedin, Instagram, Save, Wand2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeadsStore, type LeadView } from '@/stores/useLeadsStore';
import { cn, timeAgo } from '@/lib/utils';

const STATUSES = ['NEW', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'ARCHIVED'] as const;
const KINDS = [
  { v: 'CONNECTION', label: 'Connection request' },
  { v: 'FOLLOW_UP', label: 'Follow-up' },
  { v: 'SALES_PITCH', label: 'Sales pitch' },
] as const;
const TONES = ['friendly', 'professional', 'casual', 'enthusiastic'] as const;

export function LeadDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { upsertLead } = useLeadsStore();
  const [lead, setLead] = useState<LeadView | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [kind, setKind] = useState<(typeof KINDS)[number]['v']>('CONNECTION');
  const [tone, setTone] = useState<(typeof TONES)[number]>('professional');
  const [product, setProduct] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();
      setLead(data.lead);
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    if (!lead) return;
    setSaving(true);
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
        tags: lead.tags.map((t) => t.label),
      }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      upsertLead(data.lead);
      toast.success('Saved');
    } else toast.error('Failed to save');
  }

  async function generate() {
    if (!lead) return;
    setGenerating(true);
    setAiOutput('');
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, leadId: lead.id, tone, product }),
    });
    setGenerating(false);
    if (res.ok) {
      const data = await res.json();
      setAiOutput(data.message.output);
    } else toast.error('Generation failed');
  }

  function copyOutput() {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-blush-900/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="ml-auto h-full w-full max-w-2xl overflow-y-auto bg-white/95 backdrop-blur-2xl shadow-pink-glow-lg"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-blush-200 bg-white/90 px-6 py-4">
          <h2 className="text-xl font-bold text-blush-900">
            {loading ? 'Loading…' : lead?.fullName}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={!lead || saving} className="btn-primary">
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={onClose} className="btn-ghost px-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading || !lead ? (
          <div className="space-y-3 p-6">
            <div className="h-8 rounded shimmer" />
            <div className="h-8 rounded shimmer" />
            <div className="h-8 rounded shimmer" />
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Edit fields */}
            <section className="card-pink">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blush-700">
                Profile
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    className="input-pink"
                    value={lead.fullName}
                    onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className="input-pink"
                    value={lead.email ?? ''}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  />
                </Field>
                <Field label="Company">
                  <input
                    className="input-pink"
                    value={lead.company ?? ''}
                    onChange={(e) => setLead({ ...lead, company: e.target.value })}
                  />
                </Field>
                <Field label="Job title">
                  <input
                    className="input-pink"
                    value={lead.jobTitle ?? ''}
                    onChange={(e) => setLead({ ...lead, jobTitle: e.target.value })}
                  />
                </Field>
                <Field label="LinkedIn URL">
                  <div className="relative">
                    <Linkedin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blush-400" />
                    <input
                      className="input-pink pl-9"
                      value={lead.linkedinUrl ?? ''}
                      onChange={(e) => setLead({ ...lead, linkedinUrl: e.target.value })}
                    />
                  </div>
                </Field>
                <Field label="Instagram URL">
                  <div className="relative">
                    <Instagram className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blush-400" />
                    <input
                      className="input-pink pl-9"
                      value={lead.instagramUrl ?? ''}
                      onChange={(e) => setLead({ ...lead, instagramUrl: e.target.value })}
                    />
                  </div>
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Bio / context">
                  <textarea
                    rows={3}
                    className="input-pink resize-none"
                    value={lead.bio ?? ''}
                    onChange={(e) => setLead({ ...lead, bio: e.target.value })}
                  />
                </Field>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Status">
                  <select
                    className="input-pink"
                    value={lead.status}
                    onChange={(e) => setLead({ ...lead, status: e.target.value as any })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label={`Score (${lead.score})`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={lead.score}
                    onChange={(e) => setLead({ ...lead, score: Number(e.target.value) })}
                    className="w-full accent-blush-500"
                  />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Tags (comma-separated)">
                  <input
                    className="input-pink"
                    value={lead.tags.map((t) => t.label).join(', ')}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((label, i) => ({ id: `temp-${i}`, label })),
                      })
                    }
                  />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Notes">
                  <textarea
                    rows={3}
                    className="input-pink resize-none"
                    value={lead.notes ?? ''}
                    onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                    placeholder="Private notes for your team…"
                  />
                </Field>
              </div>
              <div className="mt-3 text-xs text-blush-500">
                Added {timeAgo(lead.createdAt)} · Updated {timeAgo(lead.updatedAt)}
              </div>
            </section>

            {/* AI message gen */}
            <section className="card-pink">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blush-700">
                <Sparkles className="h-4 w-4 text-blush-500" /> Generate AI message
              </h3>

              <div className="mb-3 grid gap-3 sm:grid-cols-3">
                <Field label="Kind">
                  <select className="input-pink" value={kind} onChange={(e) => setKind(e.target.value as any)}>
                    {KINDS.map((k) => (
                      <option key={k.v} value={k.v}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Tone">
                  <select className="input-pink" value={tone} onChange={(e) => setTone(e.target.value as any)}>
                    {TONES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Product (optional)">
                  <input
                    className="input-pink"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="our AI lead-gen tool"
                  />
                </Field>
              </div>

              <button onClick={generate} disabled={generating} className="btn-primary w-full sm:w-auto">
                <Wand2 className="h-4 w-4" />
                {generating ? 'Generating…' : 'Generate message'}
              </button>

              {generating && (
                <div className="mt-4 rounded-xl bg-blush-50 p-4 shimmer h-24" />
              )}

              {aiOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl border border-blush-200 bg-gradient-to-br from-blush-50 to-rose-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-blush-700">
                    <span>AI output</span>
                    <button
                      onClick={copyOutput}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs',
                        copied ? 'bg-rose-500 text-white' : 'bg-white/80 text-blush-700 hover:bg-white'
                      )}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-blush-900">
                    {aiOutput}
                  </pre>
                </motion.div>
              )}
            </section>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-blush-700">
        {label}
      </span>
      {children}
    </label>
  );
}
