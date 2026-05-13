'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Prompt {
  id: string;
  name: string;
  kind: 'CONNECTION' | 'FOLLOW_UP' | 'SALES_PITCH' | 'CUSTOM';
  body: string;
  isDefault: boolean;
}

const KIND_LABEL: Record<string, string> = {
  CONNECTION: 'Connection',
  FOLLOW_UP: 'Follow-up',
  SALES_PITCH: 'Sales pitch',
  CUSTOM: 'Custom',
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');

  async function load() {
    const res = await fetch('/api/prompts');
    const data = await res.json();
    setPrompts(data.prompts ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = filter === 'ALL' ? prompts : prompts.filter((p) => p.kind === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blush-900">Prompt Library</h1>
          <p className="mt-1 text-blush-700">
            Reusable templates that guide every AI message.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New template
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'CONNECTION', 'FOLLOW_UP', 'SALES_PITCH', 'CUSTOM'].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition',
              filter === k
                ? 'bg-pink-gradient text-white shadow-pink-glow'
                : 'bg-white/70 text-blush-700 border border-blush-200 hover:bg-blush-50'
            )}
          >
            {k === 'ALL' ? 'All' : KIND_LABEL[k]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-pink py-16 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-blush-400" />
          <p className="mt-3 text-blush-700">No templates here yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              whileHover={{ y: -4 }}
              className="card-pink card-pink-hover relative"
            >
              {p.isDefault && (
                <div className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-pink-gradient px-2 py-0.5 text-[10px] font-bold text-white shadow-pink-glow">
                  <Star className="h-3 w-3 fill-white" /> Default
                </div>
              )}
              <span className="badge-pink">{KIND_LABEL[p.kind]}</span>
              <h3 className="mt-2 text-base font-bold text-blush-900">{p.name}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-blush-700">{p.body}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddPromptModal
            onClose={() => setShowAdd(false)}
            onCreated={() => {
              setShowAdd(false);
              void load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddPromptModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('CONNECTION');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, kind, body }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Template added');
      onCreated();
    } else toast.error('Failed to add');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-blush-900/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="glass-strong w-full max-w-xl rounded-3xl p-6"
      >
        <h2 className="text-xl font-bold text-blush-900">New prompt template</h2>
        <div className="mt-4 space-y-3">
          <input
            required
            placeholder="Name (e.g. Energetic outbound)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-pink"
          />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="input-pink">
            <option value="CONNECTION">Connection request</option>
            <option value="FOLLOW_UP">Follow-up</option>
            <option value="SALES_PITCH">Sales pitch</option>
            <option value="CUSTOM">Custom</option>
          </select>
          <textarea
            required
            rows={6}
            placeholder="Tone, structure, do's and don'ts the AI should follow…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-pink resize-none"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : 'Save template'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
