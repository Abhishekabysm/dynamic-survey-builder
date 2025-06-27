'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../../lib/store';
import { fetchSurveyById, setCurrentSurvey } from '../../../../features/survey/surveySlice';
import CreateSurvey from '../create/page'; // We can reuse the create page component

export default function EditSurveyPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const surveyId = params.surveyId as string;
  const { currentSurvey, isLoading } = useAppSelector((state) => state.survey);

  useEffect(() => {
    // If we have a surveyId and it's not the one currently loaded, fetch it.
    if (surveyId && currentSurvey?.id !== surveyId) {
      dispatch(fetchSurveyById(surveyId));
    }
    
    // Cleanup when the component is unmounted
    return () => {
      dispatch(setCurrentSurvey(null));
    };
  }, [dispatch, surveyId, currentSurvey?.id]);

  if (isLoading || !currentSurvey) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading survey...</p>
      </div>
    );
  }

  // Reuse the UI from the CreateSurvey page.
  // It will be populated with the `currentSurvey` data from the store.
  return <CreateSurvey />;
} 