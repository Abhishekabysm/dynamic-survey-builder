'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchUserSurveys, deleteSurvey } from '@/features/survey/surveySlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, PlusCircle, Trash2, Edit, BarChart2 } from 'lucide-react';

export default function AllSurveysPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { surveys, isLoading } = useAppSelector((state) => state.survey);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchUserSurveys(user.uid));
    }
  }, [dispatch, user]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>All Surveys</CardTitle>
            <CardDescription>
              Here you can view, manage, and analyze all of your surveys.
            </CardDescription>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href="/dashboard/surveys/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Survey
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveys.map((survey) => (
                      <TableRow key={survey.id}>
                        <TableCell className="font-medium">{survey.title}</TableCell>
                        <TableCell>
                          <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                            {survey.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>{survey.responseCount || 0}</TableCell>
                        <TableCell>
                          {new Date(survey.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/surveys/${survey.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" /> Manage
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="block md:hidden space-y-4">
                {surveys.map((survey) => (
                  <div key={survey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{survey.title}</h3>
                      <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                        {survey.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Responses: <span className="font-medium text-foreground">{survey.responseCount || 0}</span></p>
                      <p>Created: <span className="font-medium text-foreground">{new Date(survey.createdAt).toLocaleDateString()}</span></p>
                    </div>
                    <div className="flex justify-end pt-2">
                       <Link href={`/dashboard/surveys/${survey.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="mr-2 h-4 w-4" /> Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 