'use client';

import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';

interface LeadEmptyStateProps {
  onAddLead?: () => void;
}

export function LeadEmptyState({
  onAddLead,
}: LeadEmptyStateProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-violet-200
        bg-gradient-to-br
        from-violet-50
        to-fuchsia-50
        px-8
        py-20
        text-center
      "
    >
      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-3xl
          bg-gradient-to-br
          from-violet-600
          to-fuchsia-600
          text-white
          shadow-xl
        "
      >
        <Users className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        No Leads Yet
      </h2>

      <p className="mt-3 max-w-md text-base leading-7 text-gray-600">
        Start building your outreach
        pipeline by adding leads
        manually or importing them
        through CSV.
      </p>

      <button
        onClick={onAddLead}
        className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-600
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition-all
          hover:scale-[1.03]
        "
      >
        <Sparkles className="h-4 w-4" />

        Create First Lead
      </button>
    </motion.div>
  );
}