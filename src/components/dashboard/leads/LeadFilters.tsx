'use client';

import {
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import type {
  LeadSource,
  LeadStatus,
} from '@prisma/client';

interface LeadFiltersProps {
  query: string;

  status: LeadStatus | '';

  source: LeadSource | '';

  onQueryChange: (
    value: string
  ) => void;

  onStatusChange: (
    value:
      | LeadStatus
      | ''
  ) => void;

  onSourceChange: (
    value:
      | LeadSource
      | ''
  ) => void;
}

const statuses: Array<LeadStatus> =
  [
    'NEW',
    'CONTACTED',
    'RESPONDED',
    'CONVERTED',
    'ARCHIVED',
  ];

const sources: Array<LeadSource> =
  [
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
        rounded-[30px]
        border border-neutral-200
        bg-white
        p-5
      "
    >

      <div
        className="
          flex flex-col gap-5
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

        {/* Search */}

        <div
          className="
            relative
            w-full
            xl:max-w-xl
          "
        >

          <Search
            className="
              absolute left-4 top-1/2
              h-4 w-4
              -translate-y-1/2
              text-neutral-400
            "
          />

          <input
            value={query}
            onChange={(e) =>
              onQueryChange(
                e.target.value
              )
            }
            placeholder="Search leads, companies, roles..."
            className="
              h-12 w-full
              rounded-2xl
              border border-neutral-200
              bg-neutral-50
              pl-11 pr-4
              text-sm
              text-neutral-900
              outline-none
              transition-all
              placeholder:text-neutral-400
              focus:border-neutral-300
              focus:bg-white
            "
          />
        </div>

        {/* Controls */}

        <div
          className="
            flex flex-wrap
            items-center gap-3
          "
        >

          {/* Label */}

          <div
            className="
              hidden items-center
              gap-2 rounded-2xl
              border border-neutral-200
              bg-neutral-50
              px-4 py-2.5
              text-sm font-medium
              text-neutral-600
              lg:flex
            "
          >

            <SlidersHorizontal
              className="
                h-4 w-4
              "
            />

            Filters
          </div>

          {/* Status */}

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target
                  .value as
                  | LeadStatus
                  | ''
              )
            }
            className="
              h-12
              rounded-2xl
              border border-neutral-200
              bg-white
              px-4
              text-sm
              font-medium
              text-neutral-700
              outline-none
              transition
              hover:border-neutral-300
              focus:border-neutral-400
            "
          >

            <option value="">
              All Status
            </option>

            {statuses.map(
              (
                item
              ) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          {/* Source */}

          <select
            value={source}
            onChange={(e) =>
              onSourceChange(
                e.target
                  .value as
                  | LeadSource
                  | ''
              )
            }
            className="
              h-12
              rounded-2xl
              border border-neutral-200
              bg-white
              px-4
              text-sm
              font-medium
              text-neutral-700
              outline-none
              transition
              hover:border-neutral-300
              focus:border-neutral-400
            "
          >

            <option value="">
              All Sources
            </option>

            {sources.map(
              (
                item
              ) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </div>
  );
}