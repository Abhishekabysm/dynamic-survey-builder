'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase/config';
import { Survey, resetCurrentSurvey } from '../../../../features/survey/surveySlice';
import EditSurveyForm from './EditSurveyForm';
import { useAppDispatch } from '../../../../lib/store';

export default function EditSurveyPage() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const surveyId = params.surveyId as string;

  useEffect(() => {
    if (!surveyId) {
        setError("Survey ID is missing.");
        setLoading(false);
        return;
    };

    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const surveyRef = doc(firestore, 'surveys', surveyId);
        const surveyDoc = await getDoc(surveyRef);

        if (surveyDoc.exists()) {
          setSurvey({ id: surveyDoc.id, ...surveyDoc.data() } as Survey);
        } else {
          setError('Survey not found.');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch survey.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();

    return () => {
      dispatch(resetCurrentSurvey());
    };
  }, [surveyId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading survey...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  if (!survey) {
    return <div className="text-center text-lg">No survey data found.</div>;
  }

  return <EditSurveyForm survey={survey} />;
} 