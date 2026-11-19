'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = api.getStoredUser();
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="animate-pulse text-center">
        <p className="text-amber-400 font-semibold">Redirecting to AstroBaby Admin Console...</p>
      </div>
    </div>
  );
}
