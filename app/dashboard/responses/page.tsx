'use client';

import { PuffLoader } from 'react-spinners';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchUserSurveys, Survey } from '@/features/survey/surveySlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface SurveyWithResponseCount extends Survey {
  responseCount: number;
}

export default function ResponsesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { surveys, isLoading: surveysLoading } = useAppSelector((state) => state.survey);
  const [surveysWithResponses, setSurveysWithResponses] = useState<SurveyWithResponseCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserSurveys(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchResponseCounts = async () => {
      if (surveys.length > 0) {
        setLoading(true);
        const counts = await Promise.all(
          surveys.map(async (survey) => {
            if (!survey.id) return { ...survey, responseCount: 0 };
            const responsesRef = collection(firestore, 'responses');
            const q = query(responsesRef, where('surveyId', '==', survey.id));
            const querySnapshot = await getDocs(q);
            return { ...survey, responseCount: querySnapshot.size };
          })
        );
        setSurveysWithResponses(counts);
        setLoading(false);
      } else if (!surveysLoading) {
        setLoading(false);
      }
    };

    fetchResponseCounts();
  }, [surveys, surveysLoading]);

  const allLoading = loading || surveysLoading;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 md:hidden">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Survey Responses</h1>
          <p className="text-muted-foreground">View responses for your surveys.</p>
        </div>
        {allLoading ? (
          <div className="flex justify-center items-center h-64">
            <PuffLoader color="#4A90E2" />
          </div>
        ) : surveysWithResponses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {surveysWithResponses.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <CardTitle>{survey.title}</CardTitle>
                  <CardDescription>
                    <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                      {survey.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="font-medium">Responses:</span> {survey.responseCount}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" disabled={survey.responseCount === 0} className="w-full">
                    <Link href={`/dashboard/surveys/${survey.id}/results`}>
                      <Eye className="mr-2 h-4 w-4" /> View Results
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You have no surveys yet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/surveys/create">Create a Survey</Link>
            </Button>
          </div>
        )}
      </div>

      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
          <CardDescription>View responses for your surveys.</CardDescription>
        </CardHeader>
        <CardContent>
          {allLoading ? (
            <div className="flex justify-center items-center h-64">
              <PuffLoader color="#4A90E2" />
            </div>
          ) : surveysWithResponses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Survey Title</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Responses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveysWithResponses.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">{survey.title}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                        {survey.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{survey.responseCount}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" disabled={survey.responseCount === 0}>
                        <Link href={`/dashboard/surveys/${survey.id}/results`}>
                          <Eye className="mr-2 h-4 w-4" /> View Results
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You have no surveys yet.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/surveys/create">Create a Survey</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}