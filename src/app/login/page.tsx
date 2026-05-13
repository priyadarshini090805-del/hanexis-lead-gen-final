'use client';

export const runtime = "nodejs";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      toast.error('Wrong email or password');
    } else {
      toast.success('Welcome back!');
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blush-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-rose-300/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-gradient shadow-pink-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <span className="text-2xl font-bold text-gradient">
            Hanexis
          </span>
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-blush-900">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-blush-600">
            Sign in to your lead generation hub.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-blush-700">
                Email
              </span>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blush-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-pink pl-10"
                  placeholder="you@company.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-blush-700">
                Password
              </span>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blush-400" />

                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-pink pl-10 pr-10"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blush-400 hover:text-blush-600"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-blush-200" />

            <span className="text-xs uppercase tracking-wide text-blush-500">
              or
            </span>

            <div className="h-px flex-1 bg-blush-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="btn-secondary"
              type="button"
            >
              Google
            </button>

            <button
              onClick={() => signIn('linkedin', { callbackUrl })}
              className="btn-secondary"
              type="button"
            >
              LinkedIn
            </button>

          </div>

          <p className="mt-6 text-center text-sm text-blush-700">
            New here?{' '}

            <Link
              href="/signup"
              className="font-semibold text-blush-600 hover:text-blush-700 underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}