'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchUserSurveys, deleteSurvey, publishSurvey } from '@/features/survey/surveySlice';

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export default function AllSurveysPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { surveys, isLoading } = useAppSelector((state) => state.survey);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Surveys are already fetched by the main dashboard page,
    // but we can re-fetch here in case the user navigates directly to this page.
    if (user && user.emailVerified) {
      dispatch(fetchUserSurveys(user.uid));
    }
  }, [dispatch, user]);

  const handleDeleteSurvey = (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      dispatch(deleteSurvey(surveyId));
    }
  };

  const handlePublishSurvey = (surveyId: string) => {
    if (window.confirm('Are you sure you want to publish this survey? Once published, it will be accessible to anyone with the link.')) {
      dispatch(publishSurvey(surveyId));
    }
  };

  const handleShareSurvey = (surveyId: string) => {
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Survey link copied to clipboard!'))
      .catch(() => alert('Failed to copy link.'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">All Surveys</h1>
        <Link href="/dashboard">
          <div className="text-blue-600 hover:text-blue-800">
            &larr; Back to Dashboard
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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
            {surveys.map((survey) => (
              <div key={survey.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-lg text-gray-800 mb-1">{survey.title}</h4>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">{survey.description}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    survey.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {survey.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/surveys/${survey.id}`}>
                      <div className="text-blue-600 hover:underline text-sm cursor-pointer">Edit</div>
                    </Link>
                    <button onClick={() => handleDeleteSurvey(survey.id!)} className="text-red-500 hover:text-red-700" title="Delete Survey">
                      <DeleteIcon />
                    </button>
                    {survey.isPublished ? (
                      <>
                        <Link href={`/dashboard/surveys/${survey.id}/results`}>
                          <div className="text-purple-600 hover:text-purple-800" title="View Results">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </Link>
                        <button onClick={() => handleShareSurvey(survey.id!)} className="text-green-600 hover:text-green-800" title="Copy Share Link">
                          <ShareIcon />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handlePublishSurvey(survey.id!)} className="text-gray-600 hover:text-gray-900" title="Publish Survey">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 