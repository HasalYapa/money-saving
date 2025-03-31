"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Small delay to prevent flickering during hydration
    const timer = setTimeout(() => {
      setChecking(false);
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="mt-4 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view this page.</p>
          <div className="mt-4 animate-pulse">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 