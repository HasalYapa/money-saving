"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

// Configure this page to be dynamically rendered
export const dynamic = 'force-dynamic';

// Define the Expense type interface
type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

// Component that uses useSearchParams - must be wrapped in Suspense
function EditExpenseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (!id) {
      setError('No expense ID provided');
      setLoading(false);
      return;
    }

    try {
      // Get expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      
      if (storedExpenses) {
        const expenses = JSON.parse(storedExpenses);
        const expense = expenses.find((e: any) => e.id === Number(id));
        
        if (expense) {
          // Format date for input field (YYYY-MM-DD)
          let formattedDate = expense.date;
          if (expense.date && !expense.date.includes('-')) {
            const date = new Date(expense.date);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            category: expense.category,
            amount: expense.amount.toString(),
            date: formattedDate,
            description: expense.description
          });
        } else {
          setError('Expense not found');
        }
      }
    } catch (err) {
      console.error('Error loading expense:', err);
      setError('Failed to load expense data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get existing expenses
      const storedExpenses = localStorage.getItem('expenses');
      
      if (storedExpenses && id) {
        const expenses = JSON.parse(storedExpenses);
        
        // Update expense
        const updatedExpenses = expenses.map((expense: any) => {
          if (expense.id === Number(id)) {
            return {
              ...expense,
              category: formData.category,
              amount: parseFloat(formData.amount),
              date: formData.date,
              description: formData.description
            };
          }
          return expense;
        });
        
        // Save back to localStorage
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        
        setSuccess('Expense updated successfully!');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/expenses');
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense');
      setLoading(false);
    }
  };

  if (loading && !formData.category) {
    return <div className="text-center py-10">Loading expense data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="btn-secondary"
          onClick={() => router.push('/expenses')}
        >
          Back to Expenses
        </button>
      </div>
    );
  }

  return (
    <>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="form-input"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Groceries">Groceries</option>
              <option value="Dining Out">Dining Out</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Housing">Housing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              required
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="form-input"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="form-input"
              placeholder="Enter a description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="btn-secondary mr-2"
              onClick={() => router.push('/expenses')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// Main page component with Suspense boundary
export default function EditExpense() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Expense</h1>
        <Suspense fallback={<div className="text-center py-10">Loading expense data...</div>}>
          <EditExpenseForm />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
} 