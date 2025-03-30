"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddExpense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Categories for expense categorization
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

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Parse the amount to a number
    const expense = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(), // Use timestamp as ID for this demo
      createdAt: new Date().toISOString()
    };

    // In a real app, this would be an API call
    // For demo, we'll use localStorage
    try {
      // Get existing expenses from localStorage or initialize empty array
      const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      // Add new expense to array
      const updatedExpenses = [expense, ...existingExpenses];
      
      // Save back to localStorage
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      // Add small delay to show loading state
      setTimeout(() => {
        // Redirect back to expenses list
        router.push('/expenses');
      }, 500);
    } catch (error) {
      console.error('Error saving expense:', error);
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center mb-8">
          <Link 
            href="/expenses" 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            ← Back to Expenses
          </Link>
          <h1 className="text-3xl font-bold">Add Expense</h1>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({config.currency.code})
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
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input py-2 px-3 w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this expense for?"
                className="input py-2 px-3 w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link 
                href="/expenses"
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 