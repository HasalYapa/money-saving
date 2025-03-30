"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function Expenses() {
  // State hooks
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    try {
      // Get expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      
      if (storedExpenses) {
        // Parse and set the stored expenses
        setExpenses(JSON.parse(storedExpenses));
      } else {
        // Fallback to demo data if no expenses found
        setExpenses([
          { id: 1, category: 'Groceries', amount: 78.42, date: 'May 15, 2023', description: 'Weekly groceries' },
          { id: 2, category: 'Utilities', amount: 65.00, date: 'May 14, 2023', description: 'Internet bill' },
          { id: 3, category: 'Dining Out', amount: 42.75, date: 'May 12, 2023', description: 'Dinner with friends' },
        ]);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle edit button click
  const handleEdit = (expense: Expense) => {
    // Redirect to the edit page with the expense ID
    window.location.href = `/expenses/edit?id=${expense.id}`;
  };

  // Handle delete button click
  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (expenseToDelete) {
      try {
        // Filter out the expense to delete
        const updatedExpenses = expenses.filter(exp => exp.id !== expenseToDelete.id);
        
        // Update state
        setExpenses(updatedExpenses);
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        
        // Close modal and reset
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setExpenseToDelete(null);
  };

  // Find highest spending category
  const getHighestCategory = () => {
    if (expenses.length === 0) return 'None';
    
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const highestCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];
      
    return highestCategory ? highestCategory[0] : 'None';
  };

  // Format date string for display
  const formatDate = (dateString: string) => {
    // If it's already in a readable format like "May 15, 2023", return as is
    if (dateString.includes(',')) return dateString;
    
    // Otherwise format it from ISO or YYYY-MM-DD
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Link href="/expenses/add" className="btn">
            Add Expense
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading expenses...</div>
        ) : (
          <>
            <div className="card mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Summary</h2>
                <div className="text-lg font-semibold">
                  Total: <span className="text-red-600">{config.currency.format(totalExpenses)}</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
                  <p className="text-2xl font-bold text-gray-900">{config.currency.format(totalExpenses)}</p>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Average Daily</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {config.currency.format(expenses.length > 0 ? totalExpenses / 30 : 0)}
                  </p>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Highest Category</h3>
                  <p className="text-2xl font-bold text-gray-900">{getHighestCategory()}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">All Expenses</h2>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">You haven't added any expenses yet.</p>
                  <Link href="/expenses/add" className="btn">
                    Add Your First Expense
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                            -{config.currency.format(expense.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                            <button 
                              className="text-primary-600 hover:text-primary-900"
                              onClick={() => handleEdit(expense)}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(expense)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expense?
                <br />
                <span className="font-medium">
                  {expenseToDelete?.category} - {expenseToDelete?.description} ({expenseToDelete && config.currency.format(expenseToDelete.amount)})
                </span>
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 