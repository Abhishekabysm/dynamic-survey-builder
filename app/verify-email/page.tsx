'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../lib/store';
import { resendVerificationLink, logoutUser } from '../../features/auth/authSlice';

export default function VerifyEmail() {
  const { user, isLoading, verificationEmailSent, error, needsEmailVerification } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // If user is somehow already verified, or no longer logged in, redirect them.
    if (!needsEmailVerification || !user) {
      router.push('/login');
    }
  }, [user, needsEmailVerification, router]);

  const handleResend = () => {
    dispatch(resendVerificationLink());
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600">
          We've sent a verification link to <span className="font-medium text-gray-800">{user?.email}</span>.
          Please check your inbox (and spam folder) and click the link to activate your account.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        {verificationEmailSent && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
            A new verification link has been sent to your email.
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
          <p className="text-xs text-gray-500">
            After verifying, you may need to log in again.
          </p>
          <Link href="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500">
            → Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 