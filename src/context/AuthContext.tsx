"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  name: string;
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Demo credentials
  const demoCredentials = {
    email: 'demo@example.com',
    password: 'password123'
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    if (typeof window !== 'undefined') {
      const storedLoggedIn = localStorage.getItem('isLoggedIn');
      const storedUser = localStorage.getItem('user');
      
      if (storedLoggedIn === 'true' && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
  
      // Redirect if not logged in and trying to access protected routes
      const publicRoutes = ['/auth/login', '/auth/signup', '/'];
      if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        router.push('/auth/login');
      }
    }
  }, [pathname, router, isLoggedIn]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For a real app, this would be an API call
    // Demo mode - check against demo credentials or stored users
    if (email === demoCredentials.email && password === demoCredentials.password) {
      const userData = {
        id: 'demo-user-id',
        name: 'Demo User',
        email
      };
      
      // Save to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (user && user.password === password) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        return false; // Email already exists
      }
      
      // Create new user
      const userId = `user-${Date.now()}`;
      const newUser = { 
        id: userId,
        name, 
        email, 
        password // In a real app, this would be hashed
      };
      
      // Save to users collection
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log the user in
      const userData = {
        id: userId,
        name,
        email
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 