'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { fetchUserSurveys, deleteSurvey, publishSurvey } from '@/features/survey/surveySlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, PlusCircle, Trash2, Share2, Edit, BarChart2, Eye } from 'lucide-react';

// Icons
const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

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

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { surveys, isLoading } = useAppSelector((state) => state.survey);
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.emailVerified) {
      dispatch(fetchUserSurveys(user.uid));
    }
  }, [dispatch, user]);

  const handleDelete = () => {
    if (selectedSurveyId) {
      dispatch(deleteSurvey(selectedSurveyId));
      setShowDeleteDialog(false);
      setSelectedSurveyId(null);
    }
  };

  const handlePublish = () => {
    if (selectedSurveyId) {
      dispatch(publishSurvey(selectedSurveyId));
      setShowPublishDialog(false);
      setSelectedSurveyId(null);
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
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Survey Builder</CardTitle>
          <CardDescription>
            Get started by creating a new survey or checking your existing ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/surveys/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Survey
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Recent Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-3">You haven't created any surveys yet.</p>
              <Button variant="link" asChild>
                <Link href="/dashboard/surveys/create">
                  Create your first survey
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {surveys.slice(0, 6).map((survey) => (
                <Card key={survey.id}>
                  <CardHeader>
                    <CardTitle className="truncate">{survey.title}</CardTitle>
                    <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                      {survey.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{survey.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/surveys/${survey.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {survey.isPublished ? (
                          <>
                            <DropdownMenuItem onClick={() => handleShareSurvey(survey.id!)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/surveys/${survey.id}/results`}>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Results
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSurveyId(survey.id!);
                              setShowPublishDialog(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSurveyId(survey.id!);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        {surveys.length > 6 && (
          <CardFooter className="justify-center">
            <Button variant="link" asChild>
              <Link href="/dashboard/surveys">
                View all surveys
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">{surveys.length}</div>
              <div className="text-sm text-muted-foreground">Total Surveys</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary">{surveys.filter(s => s.isPublished).length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/help" className="text-primary hover:underline">
                  How to create effective surveys?
                </Link>
              </li>
              <li>
                <Link href="/dashboard/templates" className="text-primary hover:underline">
                  Survey templates
                </Link>
              </li>
              <li>
                <Link href="/dashboard/help/response-analysis" className="text-primary hover:underline">
                  Understanding response analytics
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your survey and all its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Survey?</AlertDialogTitle>
            <AlertDialogDescription>
              Once published, this survey will be accessible to anyone with the link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 