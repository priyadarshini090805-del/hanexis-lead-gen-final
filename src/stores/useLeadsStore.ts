'use client';

import { create } from 'zustand';

import type {
  LeadStatus,
  LeadSource,
} from '@prisma/client';

export interface LeadView {
  id: string;

  fullName: string;

  email?: string | null;

  phone?: string | null;

  company?: string | null;

  companyWebsite?: string | null;

  jobTitle?: string | null;

  linkedinUrl?: string | null;

  instagramUrl?: string | null;

  bio?: string | null;

  aiSummary?: string | null;

  status: LeadStatus;

  source: LeadSource;

  score: number;

  engagementScore?: number;

  notes?: string | null;

  isQualified?: boolean;

  lastContactedAt?: string | null;

  nextFollowUpAt?: string | null;

  tags: {
    id: string;

    label: string;
  }[];

  _count?: {
    messages: number;
  };

  createdAt: string;

  updatedAt: string;
}

interface LeadsState {
  leads: LeadView[];

  loading: boolean;

  initialized: boolean;

  lastFetchedAt?: number;

  stats: Record<string, number>;

  selectedLeadId?: string | null;

  q: string;

  statusFilter: LeadStatus | '';

  sourceFilter: LeadSource | '';

  onlyQualified: boolean;

  sortBy:
    | 'latest'
    | 'score'
    | 'engagement';

  setQuery: (query: string) => void;

  setStatusFilter: (
    status: LeadStatus | ''
  ) => void;

  setSourceFilter: (
    source: LeadSource | ''
  ) => void;

  setOnlyQualified: (
    value: boolean
  ) => void;

  setSortBy: (
    sort:
      | 'latest'
      | 'score'
      | 'engagement'
  ) => void;

  selectLead: (
    leadId: string | null
  ) => void;

  fetchLeads: (
    force?: boolean
  ) => Promise<void>;

  upsertLead: (
    lead: LeadView
  ) => void;

  removeLead: (
    id: string
  ) => void;

  resetFilters: () => void;
}

const FETCH_CACHE_MS = 1000 * 20;

export const useLeadsStore =
  create<LeadsState>((set, get) => ({
    leads: [],

    loading: false,

    initialized: false,

    stats: {},

    q: '',

    statusFilter: '',

    sourceFilter: '',

    onlyQualified: false,

    sortBy: 'latest',

    selectedLeadId: null,

    setQuery: (query) => {
      set({
        q: query,
      });

      void get().fetchLeads(true);
    },

    setStatusFilter: (status) => {
      set({
        statusFilter: status,
      });

      void get().fetchLeads(true);
    },

    setSourceFilter: (source) => {
      set({
        sourceFilter: source,
      });

      void get().fetchLeads(true);
    },

    setOnlyQualified: (value) => {
      set({
        onlyQualified: value,
      });

      void get().fetchLeads(true);
    },

    setSortBy: (sortBy) => {
      set({
        sortBy,
      });

      void get().fetchLeads(true);
    },

    selectLead: (leadId) => {
      set({
        selectedLeadId: leadId,
      });
    },

    resetFilters: () => {
      set({
        q: '',

        statusFilter: '',

        sourceFilter: '',

        onlyQualified: false,

        sortBy: 'latest',
      });

      void get().fetchLeads(true);
    },

    fetchLeads: async (
      force = false
    ) => {
      const state = get();

      /*
      |--------------------------------------------------------------------------
      | Client-side Cache Protection
      |--------------------------------------------------------------------------
      |
      | Prevents unnecessary API calls during rapid dashboard interactions.
      |
      */

      if (
        !force &&
        state.lastFetchedAt &&
        Date.now() - state.lastFetchedAt <
          FETCH_CACHE_MS
      ) {
        return;
      }

      try {
        set({
          loading: true,
        });

        const params =
          new URLSearchParams();

        if (state.q) {
          params.set('q', state.q);
        }

        if (state.statusFilter) {
          params.set(
            'status',
            state.statusFilter
          );
        }

        if (state.sourceFilter) {
          params.set(
            'source',
            state.sourceFilter
          );
        }

        if (state.onlyQualified) {
          params.set(
            'qualified',
            'true'
          );
        }

        params.set(
          'sortBy',
          state.sortBy
        );

        const response = await fetch(
          `/api/leads?${params.toString()}`,
          {
            method: 'GET',

            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch leads'
          );
        }

        const data =
          await response.json();

        set({
          leads:
            data.leads ?? [],

          stats:
            data.stats ?? {},

          loading: false,

          initialized: true,

          lastFetchedAt: Date.now(),
        });
      } catch (error) {
        console.error(
          '[FETCH_LEADS_ERROR]',
          error
        );

        set({
          loading: false,
        });
      }
    },

    upsertLead: (lead) => {
      set((state) => {
        const exists =
          state.leads.findIndex(
            (item) =>
              item.id === lead.id
          );

        if (exists === -1) {
          return {
            leads: [
              lead,
              ...state.leads,
            ],
          };
        }

        const updatedLeads = [
          ...state.leads,
        ];

        updatedLeads[exists] = {
          ...updatedLeads[exists],

          ...lead,
        };

        return {
          leads: updatedLeads,
        };
      });
    },

    removeLead: (id) => {
      set((state) => ({
        leads:
          state.leads.filter(
            (lead) =>
              lead.id !== id
          ),
      }));
    },
  }));