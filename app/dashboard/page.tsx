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
  DropdownMenuSeparator,
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
import {
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Edit,
  BarChart2,
  Link as LinkIcon,
  ExternalLink,
  UploadCloud,
  List,
  Send,
  MessageSquare,
  HelpCircle,
  Book,
  BarChartHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { StatCard } from './StatCard';

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

  const publishedSurveys = surveys.filter(s => s.isPublished).length;
  const totalResponses = surveys.reduce((acc, survey) => acc + (survey.responseCount || 0), 0);

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

  const handleCopyLink = (e: React.MouseEvent, surveyId: string) => {
    e.stopPropagation();
    const link = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link Copied", {
        description: "The survey link has been copied to your clipboard.",
      });
    }).catch(err => {
      toast.error("Failed to copy link", {
        description: "Could not copy link to clipboard.",
      });
    });
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
              {surveys.slice(0, 6).map((survey, index) => (
                <div key={survey.id} className="md:p-0 p-4 border-b md:border-none last:border-b-0 md:last:border-b-0">
                  <div className="md:hidden flex justify-between items-center">
                    <h3 className="font-semibold truncate">{survey.title}</h3>
                    <Badge variant={survey.isPublished ? 'default' : 'secondary'}>
                      {survey.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <Card className="hidden md:block">
                    <CardHeader className="flex flex-row items-center justify-between">
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
                          <Button variant="secondary" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/surveys/${survey.id}/results`}>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Results
                              </Link>
                            </DropdownMenuItem>
                            {!survey.isPublished && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSurveyId(survey.id!);
                                    setShowPublishDialog(true);
                                  }}
                                >
                                  <UploadCloud className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleCopyLink(e, survey.id!)} disabled={!survey.isPublished}>
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild disabled={!survey.isPublished}>
                              <Link href={`/survey/${survey.id}`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Live Survey
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSurveyId(survey.id!);
                                setShowDeleteDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                   <div className="md:hidden mt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{survey.description}</p>
                    <div className="flex justify-end items-center mt-4 gap-2">
                       <Link href={`/dashboard/surveys/${survey.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/surveys/${survey.id}/results`}>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Results
                              </Link>
                            </DropdownMenuItem>
                            {!survey.isPublished && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSurveyId(survey.id!);
                                    setShowPublishDialog(true);
                                  }}
                                >
                                  <UploadCloud className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleCopyLink(e, survey.id!)} disabled={!survey.isPublished}>
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                             <DropdownMenuItem asChild disabled={!survey.isPublished}>
                              <Link href={`/survey/${survey.id}`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Live Survey
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSurveyId(survey.id!);
                                setShowDeleteDialog(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
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
        <div>
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                <StatCard
                  title="Total Surveys"
                  value={surveys.length}
                  icon={List}
                  color="#4A90E2"
                />
                <StatCard
                  title="Published Surveys"
                  value={publishedSurveys}
                  icon={Send}
                  color="#50E3C2"
                />
                <StatCard
                  title="Total Responses"
                  value={totalResponses}
                  icon={MessageSquare}
                  color="#F5A623"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1" className="border rounded-lg px-4 bg-background hover:bg-muted/50 transition-colors">
                  <AccordionTrigger>
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-5 w-5 text-blue-500" />
                      <span>How to create effective surveys?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8">
                    Start with a clear goal, keep your questions simple and direct,
                    and use a mix of question types to keep your audience engaged.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border rounded-lg px-4 bg-background hover:bg-muted/50 transition-colors">
                  <AccordionTrigger>
                    <div className="flex items-center space-x-3">
                      <Book className="h-5 w-5 text-green-500" />
                      <span>Survey templates</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8">
                    Explore our library of pre-built survey templates for common
                    use cases like customer feedback, market research, and employee
                    satisfaction.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border rounded-lg px-4 bg-background hover:bg-muted/50 transition-colors">
                  <AccordionTrigger>
                    <div className="flex items-center space-x-3">
                      <BarChartHorizontal className="h-5 w-5 text-orange-500" />
                      <span>Understanding response analytics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-8">
                    Our analytics dashboard helps you visualize your survey data
                    with charts and graphs, making it easy to spot trends and
                    insights.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this survey?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the survey and all its responses.
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
            <AlertDialogTitle>Are you sure you want to publish this survey?</AlertDialogTitle>
            <AlertDialogDescription>
              Once published, the survey will be live and accessible via its link. You can still unpublish it later.
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