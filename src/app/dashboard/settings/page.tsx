'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Shield, Mail, User as UserIcon, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  if (!session?.user) return null;
  const u = session.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blush-900">Settings</h1>
        <p className="mt-1 text-blush-700">Account, role, and preferences.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-pink"
      >
        <h3 className="mb-4 text-lg font-bold text-blush-900">Account</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Info icon={UserIcon} label="Name" value={u.name ?? '—'} />
          <Info icon={Mail} label="Email" value={u.email ?? '—'} />
          <Info icon={Shield} label="Role" value={u.role} highlight />
          <Info icon={Sparkles} label="User ID" value={u.id} mono />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-pink"
      >
        <h3 className="mb-2 text-lg font-bold text-blush-900">AI provider</h3>
        <p className="text-sm text-blush-700">
          Set <code className="rounded bg-blush-100 px-1 py-0.5 text-blush-800">OPENAI_API_KEY</code>{' '}
          in Vercel environment variables to switch from mock to GPT-4o-mini. The app falls back to
          mock generation if the key is missing or invalid.
        </p>
      </motion.div>

      {u.role === 'ADMIN' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-pink border-rose-300"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold text-rose-700">
            <Shield className="h-5 w-5" /> Admin area
          </h3>
          <p className="mt-2 text-sm text-blush-700">
            You have elevated access. Future admin tools (user management, org-wide reports) will
            appear here.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  highlight,
  mono,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-blush-100 bg-white/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blush-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div
        className={`mt-1 ${mono ? 'font-mono text-xs' : 'text-base font-semibold'} ${
          highlight ? 'text-gradient' : 'text-blush-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
