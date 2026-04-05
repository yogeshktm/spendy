'use client';

import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="container">
      <Suspense fallback={<div>Loading Spendy...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
