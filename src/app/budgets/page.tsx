"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define the Budget type
type Budget = {
  id: number;
  category: string;
  amount: number;
  period: string;
  notifications: boolean;
  createdAt: string;
};

// Define the Expense type needed for calculation
type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

export default function Budgets() {
  const [budgets, setBudgets] = useState<Array<Budget & { spentAmount: number; remaining: number; progress: number }>>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      // Get budgets from localStorage
      const storedBudgets = localStorage.getItem('budgets');
      const storedExpenses = localStorage.getItem('expenses');
      
      let budgetData: Budget[] = [];
      let expenseData: Expense[] = [];
      
      if (storedBudgets) {
        budgetData = JSON.parse(storedBudgets);
      }
      
      if (storedExpenses) {
        expenseData = JSON.parse(storedExpenses);
      }
      
      // Calculate spent amount for each budget category
      const processedBudgets = budgetData.map(budget => {
        // Filter expenses by category
        const categoryExpenses = expenseData.filter(expense => 
          expense.category === budget.category
        );
        
        // Calculate total spent in this category
        const spentAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Calculate remaining amount and progress
        const remaining = budget.amount - spentAmount;
        const progress = (spentAmount / budget.amount) * 100;
        
        return {
          ...budget,
          spentAmount,
          remaining,
          progress
        };
      });
      
      setBudgets(processedBudgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Handle budget deletion
  const handleDelete = (budgetId: number) => {
    try {
      // Filter out the budget to delete
      const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
      
      // Update state
      setBudgets(updatedBudgets);
      
      // Save to localStorage
      localStorage.setItem('budgets', JSON.stringify(
        updatedBudgets.map(({ spentAmount, remaining, progress, ...rest }) => rest)
      ));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <Link href="/budgets/add" className="btn">
            Add Budget
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading budgets...</div>
        ) : (
          <>
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Overall Budget</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Budget</h3>
                  <p className="text-2xl font-bold text-gray-900">{config.currency.format(totalBudget)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
                  <p className="text-2xl font-bold text-gray-900">{config.currency.format(totalSpent)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Remaining</h3>
                  <p className="text-2xl font-bold text-green-600">{config.currency.format(totalRemaining)}</p>
                </div>
              </div>
              {totalBudget > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{config.currency.format(totalSpent)} spent</span>
                    <span className="text-sm font-medium">{config.currency.format(totalBudget)} budget</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(overallProgress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{overallProgress.toFixed(1)}% of budget used</p>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Budget Categories</h2>
              {budgets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">You haven't added any budgets yet.</p>
                  <Link href="/budgets/add" className="btn">
                    Add Your First Budget
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{budget.category}</h3>
                        <div className="flex space-x-2">
                          <Link 
                            href={`/budgets/edit?id=${budget.id}`} 
                            className="text-primary-600 hover:text-primary-900 text-sm"
                          >
                            Edit
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-900 text-sm"
                            onClick={() => handleDelete(budget.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-2 text-sm">
                        <div>
                          <span className="text-gray-500">Budget: </span>
                          <span className="font-medium">{config.currency.format(budget.amount)}</span>
                          <span className="text-xs text-gray-500 ml-1">({budget.period})</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Spent: </span>
                          <span className="font-medium">{config.currency.format(budget.spentAmount)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Remaining: </span>
                          <span className={`font-medium ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {config.currency.format(budget.remaining)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${budget.progress > 85 ? 'bg-red-500' : budget.progress > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(budget.progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{budget.progress.toFixed(1)}% used</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 