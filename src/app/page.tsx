"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src="/images/finance-bg.svg" 
          alt="Background Pattern" 
          fill 
          priority
          className="object-cover"
        />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-24 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your<br />
            <span className="text-primary-600">Finances</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Track expenses, set budgets, and achieve your savings goals with our easy-to-use platform.
            Get started today and transform your financial life.
          </p>
          <Link href="/auth/signup" className="btn text-lg px-8 py-3">
            Get Started for Free
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="card bg-white bg-opacity-90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">Track Expenses</h2>
            <p className="text-gray-600 mb-4">
              Easily log and categorize your daily expenses to understand where your money is going.
            </p>
            <Link 
              href="/expenses" 
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Start tracking →
            </Link>
          </div>
          
          <div className="card bg-white bg-opacity-90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">Set Budgets</h2>
            <p className="text-gray-600 mb-4">
              Create budgets for different spending categories and get alerts when you're close to your limits.
            </p>
            <Link 
              href="/budgets" 
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Create budget →
            </Link>
          </div>
          
          <div className="card bg-white bg-opacity-90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-primary-600 mb-4">Set Savings Goals</h2>
            <p className="text-gray-600 mb-4">
              Define your savings goals and track your progress towards achieving them.
            </p>
            <Link 
              href="/goals" 
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Set goals →
            </Link>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700 font-medium mb-4">
            Join thousands of users who have improved their financial health
          </p>
          <div className="flex justify-center space-x-8 text-gray-600">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary-600">5000+</span>
              <span>Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary-600">රු 25M+</span>
              <span>Money Saved</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary-600">98%</span>
              <span>Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 