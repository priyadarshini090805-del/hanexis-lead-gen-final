'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Plus,
  Upload,
  Sparkles,
  Activity,
  TrendingUp,
  Users,
} from 'lucide-react';

import { useLeadsStore } from '@/stores/useLeadsStore';

import { LeadDrawer } from '@/components/dashboard/LeadDrawer';

import { LeadStats } from '@/components/dashboard/leads/LeadStats';

import { LeadFilters } from '@/components/dashboard/leads/LeadFilters';

import { LeadTable } from '@/components/dashboard/leads/LeadTable';

import { AddLeadModal } from '@/components/dashboard/leads/AddLeadModal';

import { ImportCsvModal } from '@/components/dashboard/leads/ImportCsvModal';

import { LeadEmptyState } from '@/components/dashboard/leads/LeadEmptyState';

export default function LeadsPage() {
  const {
    leads,
    loading,
    fetchLeads,
    removeLead,
  } = useLeadsStore();

  const [drawerId, setDrawerId] =
    useState<string | null>(null);

  const [showAdd, setShowAdd] =
    useState(false);

  const [showImport, setShowImport] =
    useState(false);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const metrics = useMemo(() => {
    const converted = leads.filter(
      (l) => l.status === 'CONVERTED'
    ).length;

    const responseRate =
      leads.length === 0
        ? 0
        : Math.round(
            (leads.filter(
              (l) =>
                l.status ===
                  'RESPONDED' ||
                l.status ===
                  'CONVERTED'
            ).length /
              leads.length) *
              100
          );

    const avgScore =
      leads.length === 0
        ? 0
        : Math.round(
            leads.reduce(
              (acc, l) =>
                acc + l.score,
              0
            ) / leads.length
          );

    return {
      total: leads.length,
      converted,
      responseRate,
      avgScore,
    };
  }, [leads]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Lead Intelligence
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950">
            Lead Pipeline
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-7 text-gray-500">
            Manage relationships, track engagement,
            and generate contextual outreach with
            AI-assisted lead operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setShowImport(true)
            }
            className="btn-secondary"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>

          <button
            onClick={() =>
              setShowAdd(true)
            }
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </section>

      {/* Metrics */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <LeadStats
          title="Total Leads"
          value={metrics.total}
          icon={Users}
          description="Active prospects tracked"
        />

        <LeadStats
          title="Conversion"
          value={`${metrics.converted}`}
          icon={TrendingUp}
          description="Converted opportunities"
        />

        <LeadStats
          title="Response Rate"
          value={`${metrics.responseRate}%`}
          icon={Activity}
          description="Pipeline engagement"
        />

        <LeadStats
          title="Average Score"
          value={metrics.avgScore}
          icon={Sparkles}
          description="AI lead quality index"
        />
      </section>

      {/* Filters */}

      <LeadFilters />

      {/* Table */}

      <motion.section
        layout
        className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
      >
        {leads.length === 0 &&
        !loading ? (
          <LeadEmptyState
            onAdd={() =>
              setShowAdd(true)
            }
          />
        ) : (
          <LeadTable
            onOpen={(id) =>
              setDrawerId(id)
            }
            onDelete={removeLead}
          />
        )}
      </motion.section>

      {/* Modals */}

      <AnimatePresence>

        {showAdd && (
          <AddLeadModal
            onClose={() =>
              setShowAdd(false)
            }
          />
        )}

        {showImport && (
          <ImportCsvModal
            onClose={() =>
              setShowImport(false)
            }
          />
        )}

        {drawerId && (
          <LeadDrawer
            id={drawerId}
            onClose={() =>
              setDrawerId(null)
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}