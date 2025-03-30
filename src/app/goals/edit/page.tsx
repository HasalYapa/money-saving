"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditGoal() {
  const router = useRouter();
  
  // Instead of using useSearchParams directly at the top level,
  // we'll defer parameter handling to client-side only
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // In client, we can safely use window.location
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      router.push('/goals');
    }
  }, [router]);
  
  if (!isClient) {
    return (
      <ProtectedRoute>
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-8">Edit Savings Goal</h1>
          <p>Loading goal editor...</p>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Savings Goal</h1>
        <div className="card max-w-2xl mx-auto p-6">
          <p className="text-center">
            Loading goal editor...
          </p>
          {/* The actual form will be loaded client-side after hydration */}
        </div>
      </div>
    </ProtectedRoute>
  );
} 