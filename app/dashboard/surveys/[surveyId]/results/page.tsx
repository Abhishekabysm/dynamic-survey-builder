'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { Survey, Question } from '@/features/survey/surveySlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

const QuestionResults = dynamic(
  () => import('@/components/survey/QuestionResults'),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4 py-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }
);

// This is a placeholder for a potential response type
interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: { questionId: string; answer: any }[];
  submittedAt: number;
}

export default function SurveyResultsPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyAndResponses = async () => {
      if (!surveyId) {
        setError("Survey ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch survey details
        const surveyRef = doc(firestore, 'surveys', surveyId);
        const surveyDoc = await getDoc(surveyRef);

        if (!surveyDoc.exists()) {
          setError('Survey not found.');
          setLoading(false);
          return;
        }
        const surveyData = { id: surveyDoc.id, ...surveyDoc.data() } as Survey;
        setSurvey(surveyData);

        // Fetch responses
        const responsesRef = collection(firestore, 'responses');
        const q = query(responsesRef, where('surveyId', '==', surveyId));
        const querySnapshot = await getDocs(q);
        const responsesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SurveyResponse[];
        setResponses(responsesData);

      } catch (e: any) {
        setError(e.message || 'Failed to fetch survey results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAndResponses();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg p-8">{error}</div>;
  }

  if (!survey) {
    return <div className="text-center text-lg p-8">No survey data found.</div>;
  }
  
  const getAnswersForQuestion = (questionId: string) => {
    return responses.map(r => r.answers.find(a => a.questionId === questionId)?.answer).filter(Boolean);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{survey.title}</CardTitle>
          <CardDescription>{survey.description}</CardDescription>
          <CardDescription>
            Total Responses: <span className="font-bold">{responses.length}</span>
          </CardDescription>
        </CardHeader>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Question Breakdown</h2>
      
      {survey.questions.length > 0 ? (
        <Accordion type="multiple" className="w-full space-y-4">
          {survey.questions.map((question) => (
            <AccordionItem value={question.id} key={question.id}>
              <AccordionTrigger className="font-bold text-lg p-4 bg-muted rounded-md">
                {question.text}
              </AccordionTrigger>
              <AccordionContent className="p-4 border rounded-b-md">
                <QuestionResults question={question} answers={getAnswersForQuestion(question.id)} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-muted-foreground">This survey has no questions.</p>
      )}
    </div>
  );
} 