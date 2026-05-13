'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#831843',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            borderRadius: '14px',
            boxShadow: '0 10px 40px -10px rgba(236, 72, 153, 0.4)',
            fontWeight: 600,
          },
          success: { iconTheme: { primary: '#ec4899', secondary: '#fff' } },
          error: { iconTheme: { primary: '#be123c', secondary: '#fff' } },
        }}
      />
    </SessionProvider>
  );
}
