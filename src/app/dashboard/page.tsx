"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define types for our data
type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

type Budget = {
  id: number;
  category: string;
  amount: number;
  period: string;
  notifications: boolean;
  createdAt: string;
};

type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // Financial summary stats
  const [currentBalance, setCurrentBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(0);
  const [primaryGoal, setPrimaryGoal] = useState<Goal | null>(null);

  useEffect(() => {
    try {
      // Load data from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      const storedBudgets = localStorage.getItem('budgets');
      const storedGoals = localStorage.getItem('goals');
      
      // Parse expenses
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
        
        // Calculate total monthly expenses
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthExpenses = parsedExpenses.filter((expense: Expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= firstDayOfMonth;
        });
        
        const totalExpenses = thisMonthExpenses.reduce(
          (sum: number, expense: Expense) => sum + expense.amount, 
          0
        );
        
        setMonthlyExpenses(totalExpenses);
      }
      
      // Parse budgets
      if (storedBudgets) {
        const parsedBudgets = JSON.parse(storedBudgets);
        setBudgets(parsedBudgets);
        
        // Calculate total budgeted amount as income
        const totalBudgeted = parsedBudgets.reduce(
          (sum: number, budget: Budget) => sum + budget.amount,
          0
        );
        
        setMonthlyIncome(totalBudgeted);
      }
      
      // Parse goals
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        setGoals(parsedGoals);
        
        // Find the primary goal (first one or emergency fund)
        const emergencyFund = parsedGoals.find(
          (goal: Goal) => goal.name.toLowerCase().includes('emergency')
        );
        
        const firstGoal = parsedGoals.length > 0 ? parsedGoals[0] : null;
        const primaryGoal = emergencyFund || firstGoal;
        
        if (primaryGoal) {
          setPrimaryGoal(primaryGoal);
          setSavingsGoal(primaryGoal.targetAmount);
          setSavings(primaryGoal.currentAmount);
          setSavingsProgress((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100);
        }
      }
      
      // Calculate current balance (income - expenses)
      const calculatedBalance = monthlyIncome - monthlyExpenses;
      setCurrentBalance(calculatedBalance > 0 ? calculatedBalance : 0);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [monthlyIncome, monthlyExpenses]);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mb-8">Here's your financial summary</p>
        
        {loading ? (
          <div className="text-center py-10">Loading dashboard data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Current Balance</h2>
                <p className="text-2xl font-bold text-gray-900">{config.currency.format(currentBalance)}</p>
              </div>
              
              <div className="card">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Monthly Budget</h2>
                <p className="text-2xl font-bold text-gray-900">{config.currency.format(monthlyIncome)}</p>
              </div>
              
              <div className="card">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Monthly Expenses</h2>
                <p className="text-2xl font-bold text-gray-900">{config.currency.format(monthlyExpenses)}</p>
              </div>
              
              <div className="card">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Remaining</h2>
                <p className="text-2xl font-bold text-gray-900">{config.currency.format(Math.max(0, monthlyIncome - monthlyExpenses))}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
                {expenses.length === 0 ? (
                  <p className="text-gray-500 py-4">No expenses recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {expenses.slice(0, 3).map(expense => (
                      <div key={expense.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-red-600 font-medium">
                          -{config.currency.format(expense.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link href="/expenses" className="text-primary-600 hover:text-primary-700 font-medium">
                    View all expenses →
                  </Link>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Savings Goal</h2>
                {primaryGoal ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">{primaryGoal.name}</p>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{config.currency.format(primaryGoal.currentAmount)}</span>
                      <span className="text-sm font-medium">{config.currency.format(primaryGoal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{savingsProgress.toFixed(1)}% of goal</p>
                  </>
                ) : (
                  <p className="text-gray-500 py-4">No savings goals set yet.</p>
                )}
                <div className="mt-4">
                  <Link href="/goals" className="text-primary-600 hover:text-primary-700 font-medium">
                    View all goals →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link href="/expenses/add" className="btn">
                Add Expense
              </Link>
              <Link href="/budgets/add" className="btn bg-secondary-600 hover:bg-secondary-700">
                Set Budget
              </Link>
              <Link href="/goals/add" className="btn bg-gray-600 hover:bg-gray-700">
                Add Goal
              </Link>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 