"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image 
                src="/images/logo.svg" 
                alt="MoneyWise Logo" 
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-primary-600">MoneyWise</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/expenses" className="text-gray-600 hover:text-primary-600">
                  Expenses
                </Link>
                <Link href="/budgets" className="text-gray-600 hover:text-primary-600">
                  Budgets
                </Link>
                <Link href="/goals" className="text-gray-600 hover:text-primary-600">
                  Goals
                </Link>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Hello, {user?.name}</span>
                <button onClick={logout} className="btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="btn">
                Login
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {isLoggedIn && (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/expenses" 
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Expenses
                  </Link>
                  <Link 
                    href="/budgets" 
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Budgets
                  </Link>
                  <Link 
                    href="/goals" 
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Goals
                  </Link>
                </>
              )}
              
              {isLoggedIn ? (
                <>
                  <div className="text-gray-600 py-2">
                    Hello, {user?.name}
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }} 
                    className="btn w-full text-center py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login" 
                  className="btn w-full text-center py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 