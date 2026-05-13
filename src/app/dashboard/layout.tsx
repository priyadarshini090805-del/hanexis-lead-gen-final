import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login?callbackUrl=/dashboard');

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed -top-32 -left-20 h-96 w-96 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -right-20 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar role={session.user.role} />
        <div className="flex flex-1 flex-col">
          <Topbar
            name={session.user.name ?? session.user.email ?? 'You'}
            email={session.user.email ?? ''}
            image={session.user.image ?? null}
            role={session.user.role}
          />
          <main className="flex-1 px-4 pb-10 pt-4 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
