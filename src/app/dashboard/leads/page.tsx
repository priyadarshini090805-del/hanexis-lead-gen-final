'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Upload,
  Trash2,
  Sparkles,
  Linkedin,
  Instagram,
  Mail,
  Tag as TagIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { useLeadsStore } from '@/stores/useLeadsStore';
import { LeadDrawer } from '@/components/dashboard/LeadDrawer';
import { cn, timeAgo } from '@/lib/utils';

const STATUSES = ['NEW', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'ARCHIVED'] as const;
const SOURCES = ['MANUAL', 'CSV', 'LINKEDIN', 'INSTAGRAM'] as const;

const STATUS_COLOR: Record<string, string> = {
  NEW: 'bg-blush-100 text-blush-700 border-blush-200',
  CONTACTED: 'bg-blush-200 text-blush-800 border-blush-300',
  RESPONDED: 'bg-rose-200 text-rose-800 border-rose-300',
  CONVERTED: 'bg-rose-500 text-white border-rose-600',
  ARCHIVED: 'bg-blush-50 text-blush-500 border-blush-200',
};

export default function LeadsPage() {
  const {
    leads,
    loading,
    q,
    statusFilter,
    sourceFilter,
    setQuery,
    setStatusFilter,
    setSourceFilter,
    fetchLeads,
    removeLead,
  } = useLeadsStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  async function onDelete(id: string) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      removeLead(id);
      toast.success('Lead deleted');
    } else toast.error('Failed to delete');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blush-900">Leads</h1>
          <p className="mt-1 text-blush-700">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'} in your pipeline
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowImport(true)} className="btn-secondary">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> New lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-pink">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blush-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, company, title…"
              className="input-pink pl-10"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blush-200 bg-white/70 p-1">
            <Filter className="ml-2 h-3.5 w-3.5 text-blush-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent py-1.5 pr-2 text-sm font-medium text-blush-800 focus:outline-none"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blush-200 bg-white/70 p-1">
            <Filter className="ml-2 h-3.5 w-3.5 text-blush-500" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="bg-transparent py-1.5 pr-2 text-sm font-medium text-blush-800 focus:outline-none"
            >
              <option value="">All sources</option>
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-pink overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blush-100/60">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Name</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Company / Role</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Status</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Tags</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Score</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Source</th>
                <th className="px-5 py-3 font-semibold uppercase tracking-wide text-xs text-blush-700">Added</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && leads.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-blush-100">
                    <td colSpan={8} className="px-5 py-4">
                      <div className="h-6 rounded shimmer" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-blush-400" />
                    <p className="mt-3 font-semibold text-blush-800">No leads yet</p>
                    <p className="text-sm text-blush-600">
                      Add your first lead or import a CSV to get started.
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                      <button onClick={() => setShowAdd(true)} className="btn-primary">
                        <Plus className="h-4 w-4" /> New lead
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {leads.map((l) => (
                    <motion.tr
                      key={l.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-blush-100 transition-colors hover:bg-blush-50/50"
                    >
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDrawerId(l.id)}
                          className="text-left font-semibold text-blush-900 hover:text-blush-600"
                        >
                          {l.fullName}
                        </button>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-blush-500">
                          {l.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {l.email}
                            </span>
                          )}
                          {l.linkedinUrl && <Linkedin className="h-3 w-3 text-blush-500" />}
                          {l.instagramUrl && <Instagram className="h-3 w-3 text-blush-500" />}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-blush-800">
                        <div className="font-medium">{l.company || '—'}</div>
                        <div className="text-xs text-blush-500">{l.jobTitle || '—'}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                            STATUS_COLOR[l.status]
                          )}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {l.tags.slice(0, 3).map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-0.5 rounded-full bg-blush-100 px-2 py-0.5 text-xs text-blush-700"
                            >
                              <TagIcon className="h-2.5 w-2.5" />
                              {t.label}
                            </span>
                          ))}
                          {l.tags.length > 3 && (
                            <span className="text-xs text-blush-500">+{l.tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-blush-100">
                            <div
                              className="h-full rounded-full bg-pink-gradient transition-all"
                              style={{ width: `${l.score}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-blush-700">{l.score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded bg-blush-50 px-2 py-0.5 text-xs font-semibold text-blush-700">
                          {l.source}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-blush-500">{timeAgo(l.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onDelete(l.id)}
                          className="rounded-lg p-1.5 text-blush-400 hover:bg-rose-100 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
        {showImport && <ImportCsvModal onClose={() => setShowImport(false)} />}
        {drawerId && <LeadDrawer id={drawerId} onClose={() => setDrawerId(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ====== Add lead modal ======
function AddLeadModal({ onClose }: { onClose: () => void }) {
  const fetchLeads = useLeadsStore((s) => s.fetchLeads);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    linkedinUrl: '',
    instagramUrl: '',
    bio: '',
    tags: '',
    score: 50,
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Lead added');
      await fetchLeads();
      onClose();
    } else {
      const data = await res.json();
      toast.error(data?.error ?? 'Failed to add lead');
    }
  }

  return (
    <ModalShell title="Add a new lead" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name *">
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input-pink"
              placeholder="Asha Patel"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-pink"
              placeholder="asha@startup.com"
            />
          </Field>
          <Field label="Company">
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="input-pink"
              placeholder="Acme Co."
            />
          </Field>
          <Field label="Job title">
            <input
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="input-pink"
              placeholder="Head of Sales"
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              className="input-pink"
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Instagram URL">
            <input
              value={form.instagramUrl}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              className="input-pink"
              placeholder="https://instagram.com/…"
            />
          </Field>
        </div>
        <Field label="Bio / context">
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="input-pink resize-none"
            placeholder="Anything that helps the AI personalize (recent post, headline, mutual interest)…"
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tags (comma-separated)">
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input-pink"
              placeholder="saas, founder, warm-intro"
            />
          </Field>
          <Field label={`Quality score (${form.score})`}>
            <input
              type="range"
              min={0}
              max={100}
              value={form.score}
              onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
              className="w-full accent-blush-500"
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Adding…' : 'Add lead'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ====== Import CSV ======
function ImportCsvModal({ onClose }: { onClose: () => void }) {
  const fetchLeads = useLeadsStore((s) => s.fetchLeads);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFile(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ''),
      complete: (result) => {
        const parsed = (result.data as any[])
          .map((r) => ({
            fullName: r.fullname || r.name || r.full_name,
            email: r.email,
            company: r.company,
            jobTitle: r.jobtitle || r.job_title || r.title,
            linkedinUrl: r.linkedinurl || r.linkedin_url || r.linkedin,
            instagramUrl: r.instagramurl || r.instagram_url || r.instagram,
            bio: r.bio,
            tags: r.tags
              ? String(r.tags)
                  .split(/[;,]/)
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : [],
          }))
          .filter((r) => r.fullName);
        setRows(parsed);
        if (parsed.length === 0) toast.error('No valid rows found. CSV must include a "fullName" column.');
      },
    });
  }

  async function onImport() {
    if (rows.length === 0) return;
    setLoading(true);
    const res = await fetch('/api/leads/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      toast.success(`Imported ${data.count} leads`);
      await fetchLeads();
      onClose();
    } else {
      toast.error('Import failed');
    }
  }

  return (
    <ModalShell title="Import leads from CSV" onClose={onClose}>
      <div className="space-y-4">
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-blush-300 bg-blush-50/40 p-8 text-center transition hover:border-blush-500 hover:bg-blush-50">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload className="mx-auto h-8 w-8 text-blush-500" />
          <p className="mt-3 font-semibold text-blush-800">Click to choose a CSV file</p>
          <p className="mt-1 text-xs text-blush-600">
            Columns: fullName, email, company, jobTitle, linkedinUrl, instagramUrl, bio, tags
          </p>
        </label>

        {rows.length > 0 && (
          <div className="rounded-xl border border-blush-200 bg-white/70 p-4">
            <div className="mb-2 text-sm font-semibold text-blush-800">
              {rows.length} valid rows ready to import
            </div>
            <div className="max-h-40 overflow-y-auto text-xs text-blush-700">
              {rows.slice(0, 6).map((r, i) => (
                <div key={i} className="border-t border-blush-100 py-1 first:border-t-0">
                  {r.fullName} — {r.company || '—'}
                </div>
              ))}
              {rows.length > 6 && <div className="border-t border-blush-100 py-1 italic">…and {rows.length - 6} more</div>}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onImport} disabled={loading || rows.length === 0} className="btn-primary">
            {loading ? 'Importing…' : `Import ${rows.length || ''}`}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-blush-900/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blush-900">{title}</h2>
          <button onClick={onClose} className="btn-ghost px-2">
            ✕
          </button>
        </div>
        {children}
      </motion.div>
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
