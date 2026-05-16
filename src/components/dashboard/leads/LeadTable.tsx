'use client';

import { motion } from 'framer-motion';

import {
  Mail,
  Building2,
  Linkedin,
  Instagram,
  ArrowUpRight,
} from 'lucide-react';

import type { LeadView } from '@/stores/useLeadsStore';

interface LeadTableProps {
  leads: LeadView[];

  onSelectLead?: (
    lead: LeadView
  ) => void;
}

function getStatusStyles(
  status: string
) {
  switch (status) {
    case 'NEW':
      return `
        bg-neutral-100
        text-neutral-700
      `;

    case 'CONTACTED':
      return `
        bg-amber-100
        text-amber-700
      `;

    case 'RESPONDED':
      return `
        bg-blue-100
        text-blue-700
      `;

    case 'CONVERTED':
      return `
        bg-emerald-100
        text-emerald-700
      `;

    case 'ARCHIVED':
      return `
        bg-neutral-200
        text-neutral-600
      `;

    default:
      return `
        bg-neutral-100
        text-neutral-700
      `;
  }
}

function initials(
  value: string
) {
  return value
    .split(' ')
    .map(
      (part) =>
        part[0]
    )
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LeadTable({
  leads,
  onSelectLead,
}: LeadTableProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[34px]
        border border-white/50
        bg-white/70
        shadow-[0_10px_60px_rgba(15,23,42,0.06)]
        backdrop-blur-2xl
      "
    >

      {/* Header */}

      <div
        className="
          flex flex-col gap-4
          border-b border-neutral-200/70
          px-7 py-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Leads
          </div>

          <h2
            className="
              mt-1 text-2xl
              font-semibold
              tracking-tight
              text-neutral-950
            "
          >
            Pipeline contacts
          </h2>
        </div>

        <div
          className="
            inline-flex items-center
            rounded-full
            border border-white/60
            bg-white/70
            px-4 py-2
            text-sm
            font-medium
            text-neutral-700
            shadow-sm
            backdrop-blur-xl
          "
        >
          {leads.length} total
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr
              className="
                border-b
                border-neutral-200/70
                bg-white/50
                backdrop-blur-xl
              "
            >

              <th
                className="
                  px-7 py-4
                  text-left text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-neutral-500
                "
              >
                Contact
              </th>

              <th
                className="
                  px-7 py-4
                  text-left text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-neutral-500
                "
              >
                Company
              </th>

              <th
                className="
                  px-7 py-4
                  text-left text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-neutral-500
                "
              >
                Status
              </th>

              <th
                className="
                  px-7 py-4
                  text-left text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-neutral-500
                "
              >
                Score
              </th>

              <th
                className="
                  px-7 py-4
                  text-left text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-neutral-500
                "
              >
                Tags
              </th>
            </tr>
          </thead>

          <tbody>

            {leads.map(
              (
                lead,
                index
              ) => (
                <motion.tr
                  key={lead.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  transition={{
                    delay:
                      index *
                      0.03,
                    duration: 0.25,
                  }}
                  onClick={() =>
                    onSelectLead?.(
                      lead
                    )
                  }
                  className="
                    group cursor-pointer
                    border-b
                    border-neutral-100/70
                    transition-all
                    duration-300
                    hover:bg-white/90
                    hover:shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                  "
                >

                  {/* Contact */}

                  <td className="px-7 py-5">

                    <div
                      className="
                        flex items-start
                        gap-4
                      "
                    >

                      {/* Avatar */}

                      <motion.div
                        whileHover={{
                          scale: 1.05,
                        }}
                        className="
                          relative flex
                          h-12 w-12
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          bg-gradient-to-br
                          from-violet-600
                          to-neutral-900
                          text-sm
                          font-semibold
                          text-white
                          shadow-lg
                        "
                      >

                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-br
                            from-white/10
                            to-transparent
                          "
                        />

                        <span className="relative z-10">
                          {initials(
                            lead.fullName
                          )}
                        </span>
                      </motion.div>

                      {/* Info */}

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <div
                          className="
                            flex items-center
                            gap-2
                          "
                        >

                          <div
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-neutral-950
                            "
                          >
                            {
                              lead.fullName
                            }
                          </div>

                          <ArrowUpRight
                            className="
                              h-3.5 w-3.5
                              opacity-0
                              transition-all
                              duration-300
                              group-hover:translate-x-0.5
                              group-hover:opacity-100
                            "
                          />
                        </div>

                        {lead.jobTitle && (
                          <div
                            className="
                              mt-1 text-sm
                              text-neutral-500
                            "
                          >
                            {
                              lead.jobTitle
                            }
                          </div>
                        )}

                        <div
                          className="
                            mt-3 flex
                            flex-wrap
                            items-center
                            gap-3
                          "
                        >

                          {lead.email && (
                            <div
                              className="
                                flex items-center
                                gap-1.5 text-xs
                                text-neutral-500
                              "
                            >
                              <Mail className="h-3.5 w-3.5" />

                              {
                                lead.email
                              }
                            </div>
                          )}

                          {lead.linkedinUrl && (
                            <motion.a
                              whileHover={{
                                y: -1,
                              }}
                              href={
                                lead.linkedinUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                text-neutral-400
                                transition
                                hover:text-blue-600
                              "
                              onClick={(
                                e
                              ) =>
                                e.stopPropagation()
                              }
                            >
                              <Linkedin className="h-4 w-4" />
                            </motion.a>
                          )}

                          {lead.instagramUrl && (
                            <motion.a
                              whileHover={{
                                y: -1,
                              }}
                              href={
                                lead.instagramUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="
                                text-neutral-400
                                transition
                                hover:text-pink-600
                              "
                              onClick={(
                                e
                              ) =>
                                e.stopPropagation()
                              }
                            >
                              <Instagram className="h-4 w-4" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}

                  <td className="px-7 py-5">

                    <div
                      className="
                        flex items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex h-11 w-11
                          items-center
                          justify-center
                          rounded-2xl
                          bg-white
                          shadow-sm
                        "
                      >
                        <Building2
                          className="
                            h-4 w-4
                            text-neutral-600
                          "
                        />
                      </div>

                      <div>

                        <div
                          className="
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {lead.company ||
                            'Unknown'}
                        </div>

                        <div
                          className="
                            mt-1 text-xs
                            uppercase
                            tracking-wide
                            text-neutral-400
                          "
                        >
                          {lead.source}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}

                  <td className="px-7 py-5">

                    <div
                      className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-3 py-1.5
                        text-xs
                        font-medium
                        shadow-sm
                        ${getStatusStyles(
                          lead.status
                        )}
                      `}
                    >
                      {lead.status}
                    </div>
                  </td>

                  {/* Score */}

                  <td className="px-7 py-5">

                    <div
                      className="
                        flex items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          relative h-2.5
                          w-24 overflow-hidden
                          rounded-full
                          bg-neutral-200
                        "
                      >

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${lead.score}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            delay:
                              index *
                              0.04,
                          }}
                          className="
                            absolute left-0
                            top-0 h-full
                            rounded-full
                            bg-gradient-to-r
                            from-violet-600
                            to-cyan-500
                          "
                        />
                      </div>

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-neutral-700
                        "
                      >
                        {lead.score}
                      </span>
                    </div>
                  </td>

                  {/* Tags */}

                  <td className="px-7 py-5">

                    <div
                      className="
                        flex flex-wrap
                        gap-2
                      "
                    >

                      {lead.tags?.length ? (
                        lead.tags.map(
                          (
                            tag
                          ) => (
                            <motion.div
                              whileHover={{
                                y: -1,
                              }}
                              key={
                                tag.id
                              }
                              className="
                                rounded-full
                                border
                                border-white/60
                                bg-white/80
                                px-3 py-1
                                text-xs
                                text-neutral-600
                                shadow-sm
                                backdrop-blur-xl
                              "
                            >
                              {
                                tag.label
                              }
                            </motion.div>
                          )
                        )
                      ) : (
                        <span
                          className="
                            text-sm
                            text-neutral-400
                          "
                        >
                          No tags
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}