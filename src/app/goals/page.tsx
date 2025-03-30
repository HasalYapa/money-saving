"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '@/lib/config';
import ProtectedRoute from '@/components/ProtectedRoute';

// Define the Goal type
type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      // Get goals from localStorage
      const storedGoals = localStorage.getItem('goals');
      
      if (storedGoals) {
        const goalsData = JSON.parse(storedGoals);
        setGoals(goalsData);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle goal deletion
  const handleDelete = (goalId: number) => {
    try {
      // Filter out the goal to delete
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      
      // Update state
      setGoals(updatedGoals);
      
      // Save to localStorage
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Handle adding funds to a goal
  const handleAddFunds = (goalId: number) => {
    const amount = prompt('Enter amount to add:');
    
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      try {
        // Update the goal with the new amount
        const updatedGoals = goals.map(goal => {
          if (goal.id === goalId) {
            const newCurrentAmount = goal.currentAmount + Number(amount);
            return {
              ...goal,
              currentAmount: newCurrentAmount
            };
          }
          return goal;
        });
        
        // Update state
        setGoals(updatedGoals);
        
        // Save to localStorage
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
      } catch (error) {
        console.error('Error adding funds:', error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <Link href="/goals/add" className="btn">
            Add Goal
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading goals...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {goals.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-500 mb-4">You haven't added any goals yet.</p>
                <Link href="/goals/add" className="btn">
                  Add Your First Goal
                </Link>
              </div>
            ) : (
              goals.map((goal) => {
                // Calculate progress percentage
                const progress = goal.currentAmount / goal.targetAmount * 100;
                
                return (
                  <div key={goal.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{goal.name}</h2>
                        <p className="text-sm text-gray-500">
                          Target date: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/goals/edit?id=${goal.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(goal.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Target</span>
                        <p className="text-lg font-semibold">{config.currency.format(goal.targetAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Saved</span>
                        <p className="text-lg font-semibold text-primary-600">{config.currency.format(goal.currentAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Remaining</span>
                        <p className="text-lg font-semibold text-gray-600">
                          {config.currency.format(goal.targetAmount - goal.currentAmount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{config.currency.format(goal.currentAmount)}</span>
                        <span>{config.currency.format(goal.targetAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% of goal</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button 
                        className="btn bg-secondary-600 hover:bg-secondary-700"
                        onClick={() => handleAddFunds(goal.id)}
                      >
                        Add funds
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 