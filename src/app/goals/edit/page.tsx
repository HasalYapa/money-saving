"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditGoal() {
  const router = useRouter();
  
  useEffect(() => {
    // Simply redirect to goals page
    router.push('/goals');
  }, [router]);
  
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-8">Redirecting...</h1>
      <p>Please visit the goals page to edit goals.</p>
    </div>
  );
} 