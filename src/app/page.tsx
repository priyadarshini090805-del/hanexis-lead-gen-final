'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, Users, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Lead Management',
    desc: 'Import, tag, and track leads from LinkedIn, Instagram, or CSV — all in one pink-tinted command center.',
  },
  {
    icon: Sparkles,
    title: 'AI Personalization',
    desc: 'Generate connection requests, follow-ups, and sales pitches that sound like you wrote them.',
  },
  {
    icon: Target,
    title: 'Status Tracking',
    desc: 'NEW → CONTACTED → RESPONDED → CONVERTED. Watch your pipeline move in real time.',
  },
  {
    icon: MessageSquare,
    title: 'Prompt Library',
    desc: 'Six battle-tested templates included. Save your own. Reuse winners across every campaign.',
  },
  {
    icon: Zap,
    title: 'OAuth + JWT Auth',
    desc: 'Sign in with email, Google, or LinkedIn. Role-based access. Sessions handled by NextAuth.',
  },
  {
    icon: TrendingUp,
    title: 'Score & Filter',
    desc: 'Quality score per lead. Search by name, company, role, or tag — results in milliseconds.',
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blush-300/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-20 -right-20 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl animate-float [animation-delay:1.5s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blush-200/50 blur-3xl animate-float [animation-delay:3s]" />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-pink-gradient shadow-pink-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">Hanexis</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blush-300/60 bg-white/60 px-4 py-1.5 text-xs font-semibold text-blush-700 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blush-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blush-500" />
            </span>
            AI-driven outreach, now with feeling
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-blush-900 sm:text-7xl">
            Turn social profiles into
            <br />
            <span className="text-gradient">conversations that convert.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blush-700/90">
            Import leads from LinkedIn and Instagram. Let AI write the first three touches.
            Track every reply. Built for sales teams who'd rather close than copy-paste.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-base">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary text-base">
              I have an account
            </Link>
          </div>
        </motion.div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="glass-strong rounded-3xl p-2">
            <div className="rounded-2xl bg-white/80 p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blush-400" />
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-blush-300" />
                <div className="ml-4 text-xs text-blush-600">app.hanexis.com/dashboard</div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Leads', val: '1,284', delta: '+12%' },
                  { label: 'Messages sent', val: '3,902', delta: '+24%' },
                  { label: 'Reply rate', val: '38%', delta: '+8%' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="rounded-2xl bg-blush-50/80 p-5 text-left"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-blush-500">
                      {s.label}
                    </div>
                    <div className="mt-1 text-3xl font-bold text-blush-900">{s.val}</div>
                    <div className="mt-1 text-xs font-semibold text-rose-600">{s.delta} this week</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-blush-900 sm:text-5xl">
            Everything in <span className="text-gradient">one pink dashboard.</span>
          </h2>
          <p className="mt-4 text-blush-700">
            Three modules. One workflow. From cold profile to warm reply.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-pink card-pink-hover group"
            >
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-pink-gradient shadow-pink-glow group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blush-900">{f.title}</h3>
              <p className="mt-2 text-sm text-blush-700/90 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="glass-strong rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-blush-900">Ready to write less and close more?</h3>
          <p className="mt-3 text-blush-700">
            Spin up an account in under 30 seconds. No credit card. No catch.
          </p>
          <Link href="/signup" className="btn-primary mt-6 text-base">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-blush-200/50 py-8 text-center text-sm text-blush-600">
        © {new Date().getFullYear()} Hanexis. Crafted in every shade of pink.
      </footer>
    </main>
  );
}
