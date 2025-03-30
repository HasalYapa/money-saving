"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

// Configure this page to be dynamically rendered
export const dynamic = 'force-dynamic';

type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
};

// Component that uses useSearchParams - must be wrapped in Suspense
function EditGoalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goalId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'createdAt'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: ''
  });
  
  useEffect(() => {
    if (!goalId) {
      setError('No goal ID provided');
      setLoading(false);
      return;
    }
    
    try {
      // Get goals from localStorage
      const storedGoals = localStorage.getItem('goals');
      
      if (storedGoals) {
        const goals: Goal[] = JSON.parse(storedGoals);
        const goal = goals.find(g => g.id === Number(goalId));
        
        if (goal) {
          // Format date for input field (YYYY-MM-DD)
          let formattedDate = goal.targetDate;
          if (goal.targetDate && !goal.targetDate.includes('-')) {
            const date = new Date(goal.targetDate);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            targetDate: formattedDate
          });
        } else {
          setError('Goal not found');
        }
      } else {
        setError('No goals found');
      }
    } catch (error) {
      console.error('Error loading goal:', error);
      setError('Error loading goal data');
    } finally {
      setLoading(false);
    }
  }, [goalId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric fields to numbers
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      // Get existing goals
      const storedGoals = localStorage.getItem('goals');
      
      if (storedGoals && goalId) {
        const goals: Goal[] = JSON.parse(storedGoals);
        
        // Update the goal with new data
        const updatedGoals = goals.map(goal => {
          if (goal.id === Number(goalId)) {
            return {
              ...goal,
              name: formData.name,
              targetAmount: formData.targetAmount,
              currentAmount: formData.currentAmount,
              targetDate: formData.targetDate
            };
          }
          return goal;
        });
        
        // Save back to localStorage
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        
        // Redirect to goals page after a brief delay
        setTimeout(() => {
          router.push('/goals');
        }, 500);
      } else {
        setError('Could not save changes');
        setSaveLoading(false);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
      setError('Failed to save changes');
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading goal data...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="btn-secondary"
          onClick={() => router.push('/goals')}
        >
          Back to Goals
        </button>
      </div>
    );
  }
  
  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-input"
            placeholder="e.g., Emergency Fund, Vacation, New Car"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{config.currency.symbol}</span>
            </div>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              min="1"
              step="0.01"
              required
              className="form-input pl-8"
              placeholder="0.00"
              value={formData.targetAmount || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Current Saved Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{config.currency.symbol}</span>
            </div>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              min="0"
              step="0.01"
              required
              className="form-input pl-8"
              placeholder="0.00"
              value={formData.currentAmount || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            required
            className="form-input"
            value={formData.targetDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="btn-secondary mr-2"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn"
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main page component with Suspense boundary
export default function EditGoal() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Savings Goal</h1>
        <Suspense fallback={<div className="text-center py-10">Loading goal data...</div>}>
          <EditGoalForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
} 