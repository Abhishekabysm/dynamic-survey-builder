'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchSurveyById } from '@/features/survey/surveySlice';
import { submitSurveyResponse } from '@/features/response/responseSlice';
import { Question } from '@/features/survey/surveySlice';

type Responses = {
  [questionId: string]: any;
};

export default function PublicSurveyPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const { currentSurvey, isLoading, error } = useAppSelector((state) => state.survey);
  const [responses, setResponses] = useState<Responses>({});

  useEffect(() => {
    if (surveyId) {
      dispatch(fetchSurveyById(surveyId));
    }
  }, [dispatch, surveyId]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formattedResponses = currentSurvey!.questions.map(question => ({
      questionId: question.id,
      questionText: question.text,
      questionType: question.type,
      answer: responses[question.id] || null,
    }));

    for (const question of currentSurvey!.questions) {
      if (question.required && !responses[question.id]) {
        alert(`Please answer the required question: "${question.text}"`);
        return;
      }
    }

    dispatch(submitSurveyResponse({
      surveyId,
      responses: formattedResponses,
      submittedAt: Date.now(),
    }));

    router.push(`/survey/${surveyId}/thank-you`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentSurvey || !currentSurvey.isPublished) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-700">Survey Not Found</h1>
        <p className="text-gray-500 mt-2">
          This survey may not exist, or it has not been published by its creator.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="border-b pb-4 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{currentSurvey.title}</h1>
          <p className="text-gray-600 mt-2">{currentSurvey.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {currentSurvey.questions.map((question, index) => (
              <div key={question.id} className="p-5 border rounded-lg bg-white shadow-sm">
                <p className="font-semibold text-base sm:text-lg text-gray-800 mb-4">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                
                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.text}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          required={question.required}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === 'TEXT' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      maxLength={question.maxLength || 500}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      required={question.required}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your answer..."
                    />
                  </div>
                )}
                
                {question.type === 'RATING' && (
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={rating}
                          onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                          required={question.required}
                          className="sr-only" // Hide the actual radio button
                        />
                        <svg
                          className={`h-10 w-10 ${responses[question.id] >= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-300 transition-colors`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      </label>
                    ))}
                  </div>
                )}
                
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              Submit Responses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 