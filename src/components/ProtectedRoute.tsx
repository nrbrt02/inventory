'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check for user cookie
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));

    if (!userCookie) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(userCookie.split('=')[1]);
      
      if (!allowedRoles.includes(user.role)) {
        router.push('/dashboard-cachier ');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    }
  }, [router, allowedRoles]);

  // Check current user role for rendering
  const getCurrentUser = () => {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
      if (!userCookie) return null;

      const user = JSON.parse(userCookie.split('=')[1]);
      return allowedRoles.includes(user.role) ? user : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}