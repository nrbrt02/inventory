'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      // router.push('/');
      return;
    }

    try {
      const userData = JSON.parse(user);
      console.log(userData)
      if (userData.role !== 'cashier') {
        // router.push('/');
      }
    } catch {
      // router.push('/');
    }
  }, [router]);

  return <div className="bg-gray-50 min-h-screen">{children}</div>;
}