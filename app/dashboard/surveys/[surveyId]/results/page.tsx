'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchSurveyById } from '@/features/survey/surveySlice';
import { fetchSurveyResponses, calculateResponseStats } from '@/features/response/responseSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SurveyResultsPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const surveyId = params.surveyId as string;

  const { currentSurvey } = useAppSelector((state) => state.survey);
  const { currentSurveyResponses, isLoading } = useAppSelector((state) => state.response);

  useEffect(() => {
    if (surveyId) {
      dispatch(fetchSurveyById(surveyId));
      dispatch(fetchSurveyResponses(surveyId));
    }
  }, [dispatch, surveyId]);

  const responseStats = useMemo(() => {
    if (currentSurvey && currentSurveyResponses.length > 0) {
      return calculateResponseStats(currentSurvey, currentSurveyResponses);
    }
    return {};
  }, [currentSurvey, currentSurveyResponses]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (!currentSurvey) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold text-gray-700">Survey not found.</h1>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{currentSurvey.title} - Results</h1>
        <p className="text-gray-600 mt-1">
          Total Responses: {currentSurveyResponses.length}
        </p>
      </div>

      {currentSurveyResponses.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow">
          <p className="text-gray-500">No responses have been collected for this survey yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {currentSurvey.questions.map((question, index) => {
            const stat = responseStats[question.id];
            if (!stat) return null;

            return (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {index + 1}. {question.text}
                  <span className="text-sm font-normal text-gray-500 ml-2">({stat.total} responses)</span>
                </h3>
                
                {stat.type === 'MULTIPLE_CHOICE' && (
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={Object.entries(stat.optionCounts).map(([name, value]) => ({ name, count: value }))}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {stat.type === 'RATING' && (
                  <div>
                    <p className="font-semibold text-lg mb-2">Average Rating: {stat.average.toFixed(2)} / 5</p>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={stat.distribution}>
                          <XAxis dataKey="rating" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {stat.type === 'TEXT' && (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {stat.responses.map((response: string, i: number) => (
                      <li key={i} className="bg-gray-50 p-3 rounded-md text-gray-700 border">
                        {response}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 