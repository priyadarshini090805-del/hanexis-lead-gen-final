'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Building2,
  Linkedin,
  Instagram,
  Sparkles,
} from 'lucide-react';

import type { LeadView } from '@/stores/useLeadsStore';

interface LeadTableProps {
  leads: LeadView[];
  onSelectLead?: (lead: LeadView) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'NEW':
      return 'bg-sky-100 text-sky-700 border-sky-200';

    case 'CONTACTED':
      return 'bg-amber-100 text-amber-700 border-amber-200';

    case 'RESPONDED':
      return 'bg-violet-100 text-violet-700 border-violet-200';

    case 'CONVERTED':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';

    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-600 border-gray-200';

    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function LeadTable({
  leads,
  onSelectLead,
}: LeadTableProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-gray-100
          px-6
          py-5
        "
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Lead Pipeline
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage, qualify and personalize outreach.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-violet-50
            px-3
            py-1.5
            text-sm
            font-semibold
            text-violet-700
          "
        >
          {leads.length} Leads
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Lead
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Score
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tags
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.03,
                }}
                onClick={() =>
                  onSelectLead?.(lead)
                }
                className="
                  cursor-pointer
                  border-b
                  border-gray-100
                  transition-all
                  hover:bg-violet-50/40
                "
              >
                {/* Lead */}

                <td className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-500
                        to-fuchsia-500
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                      "
                    >
                      {lead.fullName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900">
                        {lead.fullName}
                      </div>

                      {lead.jobTitle && (
                        <div className="mt-0.5 text-sm text-gray-500">
                          {lead.jobTitle}
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {lead.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="h-3.5 w-3.5" />
                            {lead.email}
                          </div>
                        )}

                        {lead.linkedinUrl && (
                          <Linkedin className="h-3.5 w-3.5 text-sky-600" />
                        )}

                        {lead.instagramUrl && (
                          <Instagram className="h-3.5 w-3.5 text-pink-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Company */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />

                    <div>
                      <div className="font-medium text-gray-800">
                        {lead.company || 'Unknown'}
                      </div>

                      <div className="text-xs text-gray-500">
                        {lead.source}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}

                <td className="px-6 py-5">
                  <div
                    className={`
                      inline-flex
                      items-center
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${getStatusColor(lead.status)}
                    `}
                  >
                    {lead.status}
                  </div>
                </td>

                {/* Score */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />

                    <span className="font-semibold text-gray-800">
                      {lead.score}/100
                    </span>
                  </div>
                </td>

                {/* Tags */}

                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {lead.tags?.length ? (
                      lead.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="
                            rounded-full
                            bg-gray-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-gray-600
                          "
                        >
                          {tag.label}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        No tags
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}