'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import type { LeadSource, LeadStatus } from '@prisma/client';

interface LeadFiltersProps {
  query: string;
  status: LeadStatus | '';
  source: LeadSource | '';
  onQueryChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | '') => void;
  onSourceChange: (value: LeadSource | '') => void;
}

const statuses: Array<LeadStatus> = [
  'NEW',
  'CONTACTED',
  'RESPONDED',
  'CONVERTED',
  'ARCHIVED',
];

const sources: Array<LeadSource> = [
  'MANUAL',
  'CSV',
  'LINKEDIN',
  'INSTAGRAM',
];

export function LeadFilters({
  query,
  status,
  source,
  onQueryChange,
  onStatusChange,
  onSourceChange,
}: LeadFiltersProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      {/* Search */}

      <div className="relative w-full lg:max-w-md">
        <Search
          className="
            absolute
            left-4
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search leads, companies, roles..."
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            py-3
            pl-11
            pr-4
            text-sm
            text-gray-800
            outline-none
            transition-all
            placeholder:text-gray-400
            focus:border-violet-300
            focus:bg-white
            focus:ring-4
            focus:ring-violet-100
          "
        />
      </div>

      {/* Filters */}

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-gray-200
            bg-gray-50
            px-3
            py-2
          "
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />

          <span className="text-sm font-medium text-gray-600">
            Filters
          </span>
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as LeadStatus | '')
          }
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            outline-none
            transition-all
            hover:border-gray-300
            focus:border-violet-300
            focus:ring-4
            focus:ring-violet-100
          "
        >
          <option value="">All Status</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Source */}

        <select
          value={source}
          onChange={(e) =>
            onSourceChange(e.target.value as LeadSource | '')
          }
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            outline-none
            transition-all
            hover:border-gray-300
            focus:border-violet-300
            focus:ring-4
            focus:ring-violet-100
          "
        >
          <option value="">All Sources</option>

          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}