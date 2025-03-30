"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditExpense() {
  const router = useRouter();
  
  useEffect(() => {
    // Simply redirect to expenses page
    router.push('/expenses');
  }, [router]);
  
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-8">Redirecting...</h1>
      <p>Please visit the expenses page to edit expenses.</p>
    </div>
  );
} 