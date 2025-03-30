// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Not included in responses
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export type ExpenseCategory = 
  | 'Housing' 
  | 'Transportation' 
  | 'Food' 
  | 'Utilities' 
  | 'Insurance' 
  | 'Healthcare' 
  | 'Debt' 
  | 'Personal' 
  | 'Entertainment' 
  | 'Clothing' 
  | 'Education' 
  | 'Gifts' 
  | 'Savings' 
  | 'Investments' 
  | 'Other';

// Expense types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Budget types
export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard types
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetOverview: {
    category: ExpenseCategory;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
  recentExpenses: Expense[];
  savingsProgress: {
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    progress: number;
  }[];
} 