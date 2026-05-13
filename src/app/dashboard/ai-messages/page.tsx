'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, timeAgo } from '@/lib/utils';

const KINDS = [
  { v: 'CONNECTION', label: 'Connection request', desc: 'Short LinkedIn invite copy' },
  { v: 'FOLLOW_UP', label: 'Follow-up', desc: 'Polite second-touch message' },
  { v: 'SALES_PITCH', label: 'Sales pitch', desc: 'Full personalized pitch' },
] as const;
const TONES = ['friendly', 'professional', 'casual', 'enthusiastic'] as const;

interface MessageItem {
  id: string;
  kind: 'CONNECTION' | 'FOLLOW_UP' | 'SALES_PITCH' | 'CUSTOM';
  output: string;
  model: string;
  createdAt: string;
  lead?: { fullName: string; company: string | null } | null;
}

export default function AIMessagesPage() {
  const [kind, setKind] = useState<(typeof KINDS)[number]['v']>('CONNECTION');
  const [tone, setTone] = useState<(typeof TONES)[number]>('professional');
  const [product, setProduct] = useState('');
  const [form, setForm] = useState({ fullName: '', company: '', jobTitle: '', bio: '' });
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<MessageItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function loadHistory() {
    const res = await fetch('/api/ai/generate');
    if (res.ok) {
      const data = await res.json();
      setHistory(data.messages);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function generate() {
    if (!form.fullName) {
      toast.error("At least a recipient name is required");
      return;
    }
    setGenerating(true);
    setOutput('');
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind,
        tone,
        product,
        ephemeralLead: form,
      }),
    });
    setGenerating(false);
    if (res.ok) {
      const data = await res.json();
      setOutput(data.message.output);
      await loadHistory();
    } else toast.error('Generation failed');
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blush-900">AI Messages</h1>
        <p className="mt-1 text-blush-700">Generate personalized outreach in seconds.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Generator */}
        <div className="card-pink lg:col-span-2">
          <h3 className="flex items-center gap-2 text-lg font-bold text-blush-900">
            <Sparkles className="h-5 w-5 text-blush-500" />
            Compose a new message
          </h3>

          {/* Kind picker */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {KINDS.map((k) => (
              <button
                key={k.v}
                onClick={() => setKind(k.v)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all',
                  kind === k.v
                    ? 'border-blush-500 bg-pink-gradient text-white shadow-pink-glow'
                    : 'border-blush-200 bg-white/70 text-blush-800 hover:border-blush-400 hover:-translate-y-0.5'
                )}
              >
                <div className="font-semibold">{k.label}</div>
                <div className={cn('text-xs', kind === k.v ? 'text-white/90' : 'text-blush-500')}>
                  {k.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Recipient name *">
              <input
                className="input-pink"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Asha Patel"
              />
            </Field>
            <Field label="Company">
              <input
                className="input-pink"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme Co."
              />
            </Field>
            <Field label="Job title">
              <input
                className="input-pink"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="Head of Sales"
              />
            </Field>
            <Field label="Tone">
              <select
                className="input-pink"
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
              >
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-3">
            <Field label="What you're offering (optional)">
              <input
                className="input-pink"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="our AI lead-gen platform"
              />
            </Field>
          </div>

          <div className="mt-3">
            <Field label="About them (recent post, headline, etc.)">
              <textarea
                rows={3}
                className="input-pink resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Just raised Series A. Posted about hiring SDRs. Speaks at SaaStr."
              />
            </Field>
          </div>

          <button onClick={generate} disabled={generating} className="btn-primary mt-5 w-full sm:w-auto">
            <Wand2 className="h-4 w-4" />
            {generating ? 'Generating…' : 'Generate message'}
          </button>

          {generating && <div className="mt-5 h-32 rounded-2xl shimmer" />}

          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border border-blush-200 bg-gradient-to-br from-blush-50 to-rose-50 p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="badge-pink">{kind.replace('_', ' ')}</span>
                  <button
                    onClick={() => copy(output, 'live')}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                      copiedId === 'live'
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/80 text-blush-700 hover:bg-white'
                    )}
                  >
                    {copiedId === 'live' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedId === 'live' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-blush-900">
                  {output}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History */}
        <div className="card-pink">
          <h3 className="mb-3 text-lg font-bold text-blush-900">Recent generations</h3>
          {history.length === 0 ? (
            <p className="text-sm text-blush-500">Your generated messages appear here.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-blush-100 bg-white/70 p-3 transition hover:border-blush-300"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="badge-pink">{m.kind.replace('_', ' ')}</span>
                    <button
                      onClick={() => copy(m.output, m.id)}
                      className="rounded-full p-1 text-blush-500 hover:bg-blush-100 hover:text-blush-700"
                    >
                      {copiedId === m.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <p className="line-clamp-3 text-sm text-blush-800">{m.output}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-blush-500">
                    <span>{m.lead?.fullName ?? 'No lead linked'}</span>
                    <span>{timeAgo(m.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
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
