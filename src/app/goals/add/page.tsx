"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
};

export default function AddGoal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'createdAt' | 'currentAmount'>>({
    name: '',
    targetAmount: 0,
    targetDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert amount field to number
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
    setLoading(true);
    
    try {
      // Create goal object
      const goal: Goal = {
        id: Date.now(),
        name: formData.name,
        targetAmount: formData.targetAmount,
        currentAmount: 0, // Start with 0 saved
        targetDate: formData.targetDate,
        createdAt: new Date().toISOString()
      };
      
      // Get existing goals from localStorage
      const existingGoals = localStorage.getItem('goals');
      let goals: Goal[] = [];
      
      if (existingGoals) {
        goals = JSON.parse(existingGoals);
      }
      
      // Add new goal to array
      goals.push(goal);
      
      // Save back to localStorage
      localStorage.setItem('goals', JSON.stringify(goals));
      
      // Redirect to goals page after a brief delay
      setTimeout(() => {
        router.push('/goals');
      }, 500);
      
    } catch (error) {
      console.error('Error saving goal:', error);
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8">Add New Savings Goal</h1>
        
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
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 