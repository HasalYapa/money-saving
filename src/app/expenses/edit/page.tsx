"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define the Expense type interface
type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

export default function EditExpense() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  // State for form data
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    category: '',
    amount: 0,
    date: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
  
  // Fetch expense data based on id
  useEffect(() => {
    if (id) {
      const expenseId = parseInt(id);
      
      try {
        // Get expenses from localStorage
        const storedExpenses = localStorage.getItem('expenses');
        
        if (storedExpenses) {
          const expenses: Expense[] = JSON.parse(storedExpenses);
          const expense = expenses.find(e => e.id === expenseId);
          
          if (expense) {
            // Format date from "May 15, 2023" to "2023-05-15" or use as is if already in that format
            const formattedDate = expense.date.includes('-') 
              ? expense.date 
              : formatDateForInput(expense.date);

            setFormData({
              category: expense.category,
              amount: expense.amount,
              date: formattedDate,
              description: expense.description
            });
            setLoading(false);
          } else {
            setError('Expense not found');
            setLoading(false);
          }
        } else {
          setError('No expenses found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading expense:', error);
        setError('Failed to load expense data');
        setLoading(false);
      }
    } else {
      setError('No expense ID provided');
      setLoading(false);
    }
  }, [id]);
  
  // Helper function to format date for input field
  const formatDateForInput = (dateString: string) => {
    try {
      const dateParts = dateString.match(/(\w+) (\d+), (\d+)/);
      if (dateParts) {
        const [_, month, day, year] = dateParts;
        const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
        return `${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return new Date().toISOString().split('T')[0]; // Fallback to today
    } catch (e) {
      return new Date().toISOString().split('T')[0]; // Fallback to today
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      // Get expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      if (!storedExpenses) {
        setError('No expenses found');
        return;
      }
      
      const expenses: Expense[] = JSON.parse(storedExpenses);
      const expenseId = parseInt(id);
      
      // Find the index of the expense to update
      const expenseIndex = expenses.findIndex(e => e.id === expenseId);
      
      if (expenseIndex === -1) {
        setError('Expense not found');
        return;
      }
      
      // Create updated expense object
      const updatedExpense: Expense = {
        ...expenses[expenseIndex], // Keep existing properties like ID
        ...formData, // Update with new form data
        amount: typeof formData.amount === 'string' 
          ? parseFloat(formData.amount) 
          : formData.amount
      };
      
      // Update the expense in the array
      expenses[expenseIndex] = updatedExpense;
      
      // Save back to localStorage
      localStorage.setItem('expenses', JSON.stringify(expenses));
      
      // Show success message
      setSuccess(true);
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/expenses');
      }, 1500);
    } catch (error) {
      console.error('Error updating expense:', error);
      setError('Failed to update expense');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded-lg">
          <h1 className="text-xl font-semibold text-red-700">Error</h1>
          <p className="mt-2 text-red-600">{error}</p>
          <Link
            href="/expenses"
            className="mt-4 inline-block text-primary-600 hover:text-primary-800"
          >
            ← Back to Expenses
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

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
          <h1 className="text-3xl font-bold">Edit Expense</h1>
        </div>

        {success ? (
          <div className="max-w-2xl mx-auto p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700">Success!</h2>
            <p className="mt-2 text-green-600">Your expense has been updated.</p>
            <p className="mt-1 text-green-600">Redirecting to expenses list...</p>
          </div>
        ) : (
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
                >
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 