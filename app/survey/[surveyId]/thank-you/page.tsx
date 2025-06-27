'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ThankYouPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg">
        <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800">Thank You!</h1>
        <p className="text-gray-600 mt-2 mb-6">
          Your response has been submitted successfully.
        </p>
        <Link href="/">
          <div className="text-blue-600 hover:text-blue-800 font-medium">
            Go back to the homepage
          </div>
        </Link>
      </div>
    </div>
  );
} 