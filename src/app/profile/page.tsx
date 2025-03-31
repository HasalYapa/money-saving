"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalBudgets: 0,
    totalGoals: 0
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      setLoading(false);
      
      // Load user stats from localStorage
      try {
        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        
        setStats({
          totalExpenses: expenses.length,
          totalBudgets: budgets.length,
          totalGoals: goals.length
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    }
  }, [isLoggedIn, user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          <p>Loading your profile...</p>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">Account ID: {user?.id}</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Your Activity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-blue-50">
            <h3 className="font-semibold mb-2">Expenses</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalExpenses}</p>
            <p className="text-sm text-gray-600 mt-2">Total expenses tracked</p>
          </div>
          
          <div className="card bg-green-50">
            <h3 className="font-semibold mb-2">Budgets</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalBudgets}</p>
            <p className="text-sm text-gray-600 mt-2">Active budgets</p>
          </div>
          
          <div className="card bg-purple-50">
            <h3 className="font-semibold mb-2">Goals</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalGoals}</p>
            <p className="text-sm text-gray-600 mt-2">Savings goals set</p>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          <p className="text-gray-600 mb-6">
            Manage your account settings and preferences
          </p>
          
          <div className="space-y-4">
            <button className="btn btn-outline w-full md:w-auto">
              Change Password
            </button>
            
            <button className="btn btn-outline w-full md:w-auto">
              Update Profile
            </button>
            
            <button className="btn btn-outline btn-error w-full md:w-auto">
              Delete Account
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Note: This is a demo application. Account settings functionality is not fully implemented.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 