"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="mb-8 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn btn-primary px-6">
          Go Home
        </Link>
      </div>
    </div>
  );
} 