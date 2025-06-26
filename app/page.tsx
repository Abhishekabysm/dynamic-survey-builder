'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../lib/store';
import { logoutUser } from '../features/auth/authSlice';

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          Dynamic Survey Builder
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Create beautiful surveys, gather responses, and analyze results - all in one platform
        </p>
        
        {mounted && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {user ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-red-600 rounded-lg shadow-lg border border-red-200 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium">
                    Login
                  </div>
                </Link>
                <Link href="/register">
                  <div className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-lg shadow-lg border border-blue-200 transition-colors duration-200 font-medium">
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2">Easy Survey Creation</h3>
            <p className="text-gray-600">Drag and drop interface with multiple question types and live preview</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2">Simple Distribution</h3>
            <p className="text-gray-600">Share your survey with a unique link that works on all devices</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2">Rich Analytics</h3>
            <p className="text-gray-600">Beautiful charts and insights to understand your response data</p>
          </div>
        </div>
      </div>
    </main>
  );
}
