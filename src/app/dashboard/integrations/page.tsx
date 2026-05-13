'use client';

import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const integrations = [
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    desc: 'Sign in with LinkedIn to import your network and personalize connection requests.',
    cta: 'Connect LinkedIn',
    enabled: true,
  },
  {
    key: 'google',
    name: 'Google',
    icon: Sparkles,
    desc: 'Sign in with Google to enable single sign-on and calendar sync (coming soon).',
    cta: 'Connect Google',
    enabled: true,
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    desc: 'Pull leads from Instagram followers and DMs. Requires Meta Business approval — coming soon.',
    cta: 'Coming soon',
    enabled: false,
  },
] as const;

export default function IntegrationsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blush-900">Integrations</h1>
        <p className="mt-1 text-blush-700">Wire up your social channels and tools.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((it, i) => (
          <motion.div
            key={it.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn('card-pink card-pink-hover relative', !it.enabled && 'opacity-70')}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-pink-gradient shadow-pink-glow">
                <it.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-blush-900">{it.name}</h3>
                <p className="text-xs text-blush-500">
                  {it.enabled ? 'Available' : 'Not available yet'}
                </p>
              </div>
            </div>
            <p className="min-h-[3rem] text-sm text-blush-700">{it.desc}</p>
            {it.enabled ? (
              <button
                onClick={() => signIn(it.key === 'google' ? 'google' : 'linkedin')}
                className="btn-primary mt-4 w-full"
              >
                <CheckCircle2 className="h-4 w-4" />
                {it.cta}
              </button>
            ) : (
              <button disabled className="btn-secondary mt-4 w-full opacity-60">
                <Lock className="h-4 w-4" />
                {it.cta}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="card-pink">
        <h3 className="text-lg font-bold text-blush-900">Why is Instagram disabled?</h3>
        <p className="mt-2 text-sm text-blush-700">
          The Instagram Graph API requires a Meta Business Verification and app review process
          that typically takes 1–4 weeks. We've stubbed the UI so you can test the flow end-to-end
          today, and switching to real OAuth is a one-line change once your developer app is
          approved.
        </p>
      </div>

      {session?.user && (
        <div className="card-pink">
          <h3 className="text-lg font-bold text-blush-900">Signed in as</h3>
          <div className="mt-2 inline-flex items-center gap-3 rounded-full bg-blush-50 px-4 py-2 text-sm text-blush-800">
            <CheckCircle2 className="h-4 w-4 text-rose-500" />
            {session.user.email} <span className="text-blush-500">·</span>{' '}
            <span className="font-semibold">{session.user.role}</span>
          </div>
        </div>
      )}
    </div>
  );
}
