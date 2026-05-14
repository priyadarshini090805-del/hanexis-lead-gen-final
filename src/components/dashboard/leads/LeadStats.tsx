'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface LeadStatsProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function LeadStats({
  title,
  value,
  description,
  icon: Icon,
}: LeadStatsProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        hover:border-violet-200
        hover:shadow-lg
      "
    >
      {/* Background glow */}

      <div
        className="
          absolute
          right-0
          top-0
          h-24
          w-24
          rounded-full
          bg-violet-100/40
          blur-3xl
          transition-opacity
          group-hover:opacity-100
        "
      />

      {/* Header */}

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <div className="mt-3 text-4xl font-bold tracking-tight text-gray-950">
            {value}
          </div>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-violet-100
            bg-violet-50
            text-violet-700
          "
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Footer */}

      <div className="relative mt-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {description}
        </p>

        <div
          className="
            rounded-full
            bg-emerald-50
            px-2.5
            py-1
            text-xs
            font-semibold
            text-emerald-600
          "
        >
          Live
        </div>
      </div>
    </motion.div>
  );
}