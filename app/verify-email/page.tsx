'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../lib/store';
import { resendVerificationLink, logoutUser } from '../../features/auth/authSlice';
import { auth } from '../../firebase/config';

export default function VerifyEmail() {
  const { user, isLoading, verificationEmailSent, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // This effect will periodically check the user's verification status
    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
        // Force a reload of the user's profile from Firebase
        await auth.currentUser.reload();
        
        // If the email is now verified, redirect them
        if (auth.currentUser.emailVerified) {
          console.log('Email successfully verified! Redirecting to dashboard...');
          clearInterval(intervalId);
          // We push to /login, which will then see a verified user and redirect to /dashboard.
          // This ensures all state is correctly updated by the main auth listener.
          router.push('/login');
        }
      }
    }, 3000); // Check every 3 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [router]);

  useEffect(() => {
    // If the user logs out or the session ends, redirect to login
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleResend = () => {
    dispatch(resendVerificationLink());
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-pulse text-blue-500 mb-4">
          <svg className="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600">
          We've sent a verification link to <span className="font-medium text-gray-800">{user?.email}</span>.
          Please check your inbox and click the link to activate your account.
        </p>

        <p className="text-sm text-gray-500 pt-2">
          This page will automatically redirect after you've verified your email.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        {verificationEmailSent && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
            A new verification link has been sent.
          </div>
        )}
        
        <div className="mt-4 flex flex-col space-y-3">
          <button
            onClick={handleResend}
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? 'Sending...' : 'Resend Verification Link'}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Log Out
          </button>
        </div>
        
        <div className="mt-2 text-center">
          <Link href="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500">
            → Manually go to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 