'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchUserSurveys } from '@/features/survey/surveySlice';

// Icons
const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { surveys, isLoading } = useAppSelector((state) => state.survey);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && user.emailVerified) {
      console.log('Fetching surveys for user:', user.uid);
      dispatch(fetchUserSurveys(user.uid));
    }
  }, [dispatch, user]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Survey Builder</h2>
          <Link href="/dashboard/surveys/create">
            <div className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-sm transition-colors">
              <CreateIcon />
              <span className="ml-2">Create Survey</span>
            </div>
          </Link>
        </div>
        <p className="text-gray-600">
          Get started by creating a new survey or checking your existing ones.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Recent Surveys</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-3">You haven't created any surveys yet.</p>
            <Link href="/dashboard/surveys/create">
              <div className="text-blue-600 hover:text-blue-800 font-medium">
                Create your first survey
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {surveys.slice(0, 6).map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-gray-800 mb-1">{survey.title}</h4>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{survey.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    survey.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {survey.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/dashboard/surveys/${survey.id}`}>
                    <div className="text-blue-600 hover:underline text-sm">View details</div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {surveys.length > 6 && (
          <div className="mt-4 text-center">
            <Link href="/dashboard/surveys">
              <div className="text-blue-600 hover:text-blue-800">
                View all surveys
              </div>
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">{surveys.length}</div>
              <div className="text-sm text-gray-600">Total Surveys</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-700">{surveys.filter(s => s.isPublished).length}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/dashboard/help">
                <div className="text-blue-600 hover:text-blue-800 hover:underline">
                  How to create effective surveys?
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/templates">
                <div className="text-blue-600 hover:text-blue-800 hover:underline">
                  Survey templates
                </div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/help/response-analysis">
                <div className="text-blue-600 hover:text-blue-800 hover:underline">
                  Understanding response analytics
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 