"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

type Period = 'weekly' | 'monthly' | 'yearly';

export default function AddBudget() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as Period,
    notifications: false
  });

  // Categories for budget categorization
  const categories = [
    'Groceries',
    'Dining Out',
    'Transportation',
    'Utilities',
    'Housing',
    'Entertainment',
    'Shopping',
    'Health',
    'Education',
    'Personal Care',
    'Other',
  ];

  // Budget periods
  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Create budget object
    const budget = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(), // Use timestamp as ID for this demo
      createdAt: new Date().toISOString()
    };

    try {
      // Get existing budgets from localStorage or initialize empty array
      const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      
      // Add new budget to array
      const updatedBudgets = [budget, ...existingBudgets];
      
      // Save back to localStorage
      localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      
      // Add small delay to show loading state
      setTimeout(() => {
        // Redirect back to budgets list
        router.push('/budgets');
      }, 500);
    } catch (error) {
      console.error('Error saving budget:', error);
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center mb-8">
          <Link 
            href="/budgets" 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            ← Back to Budgets
          </Link>
          <h1 className="text-3xl font-bold">Set Budget</h1>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input py-2 px-3 w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Amount ({config.currency.code})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  {config.currency.symbol}
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="0.00"
                  className="input py-2 px-3 pl-8 w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="input py-2 px-3 w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notifications" className="font-medium text-gray-700">
                    Enable notifications
                  </label>
                  <p className="text-gray-500">Get notified when you're close to your budget limit</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link 
                href="/budgets"
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Budget'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 