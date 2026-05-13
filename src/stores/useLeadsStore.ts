'use client';

import { create } from 'zustand';
import type { LeadStatus, LeadSource } from '@prisma/client';

export interface LeadView {
  id: string;
  fullName: string;
  email?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  bio?: string | null;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  notes?: string | null;
  tags: { id: string; label: string }[];
  _count?: { messages: number };
  createdAt: string;
  updatedAt: string;
}

interface LeadsState {
  leads: LeadView[];
  stats: Record<string, number>;
  loading: boolean;
  q: string;
  statusFilter: LeadStatus | '';
  sourceFilter: LeadSource | '';
  setQuery: (q: string) => void;
  setStatusFilter: (s: LeadStatus | '') => void;
  setSourceFilter: (s: LeadSource | '') => void;
  fetchLeads: () => Promise<void>;
  upsertLead: (l: LeadView) => void;
  removeLead: (id: string) => void;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  stats: {},
  loading: false,
  q: '',
  statusFilter: '',
  sourceFilter: '',
  setQuery: (q) => {
    set({ q });
    void get().fetchLeads();
  },
  setStatusFilter: (s) => {
    set({ statusFilter: s });
    void get().fetchLeads();
  },
  setSourceFilter: (s) => {
    set({ sourceFilter: s });
    void get().fetchLeads();
  },
  fetchLeads: async () => {
    const { q, statusFilter, sourceFilter } = get();
    set({ loading: true });
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (statusFilter) params.set('status', statusFilter);
    if (sourceFilter) params.set('source', sourceFilter);
    const res = await fetch(`/api/leads?${params.toString()}`);
    const data = await res.json();
    set({ leads: data.leads ?? [], stats: data.stats ?? {}, loading: false });
  },
  upsertLead: (l) =>
    set((s) => {
      const i = s.leads.findIndex((x) => x.id === l.id);
      if (i === -1) return { leads: [l, ...s.leads] };
      const next = [...s.leads];
      next[i] = l;
      return { leads: next };
    }),
  removeLead: (id) =>
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
}));
