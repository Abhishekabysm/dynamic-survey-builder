'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { Survey, Question, Option } from '@/features/survey/surveySlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function TakeSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!surveyId) return;

    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const surveyRef = doc(firestore, 'surveys', surveyId);
        const surveyDoc = await getDoc(surveyRef);

        if (surveyDoc.exists() && surveyDoc.data().isPublished) {
          setSurvey({ id: surveyDoc.id, ...surveyDoc.data() } as Survey);
        } else {
          setError('This survey is not available.');
        }
      } catch (e) {
        setError('Failed to load the survey.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);
  
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Basic validation
    if (survey?.questions.some(q => q.required && !answers[q.id])) {
      alert('Please answer all required questions.');
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(firestore, 'responses'), {
        surveyId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
        submittedAt: Date.now(),
      });
      router.push(`/survey/${surveyId}/thank-you`);
    } catch (err) {
      setError('Failed to submit your response. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg p-8">{error}</div>;
  }

  if (!survey) {
    return null;
  }

  return (
    <div className="bg-muted min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{survey.title}</CardTitle>
          <CardDescription>{survey.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {survey.questions.map((q, index) => (
              <div key={q.id}>
                <Label className="font-semibold text-lg">
                  {index + 1}. {q.text} {q.required && <span className="text-destructive">*</span>}
                </Label>
                <div className="pt-2">
                  {renderQuestionInput(q, answers[q.id], handleAnswerChange)}
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function renderQuestionInput(question: Question, value: any, onChange: (questionId: string, value: any) => void) {
    switch (question.type) {
        case 'MULTIPLE_CHOICE':
            return (
                <RadioGroup value={value} onValueChange={(val) => onChange(question.id, val)}>
                    {(question.options || []).map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.text} id={option.id} />
                            <Label htmlFor={option.id}>{option.text}</Label>
                        </div>
                    ))}
                </RadioGroup>
            );
        case 'TEXT':
            return <Textarea value={value || ''} onChange={(e) => onChange(question.id, e.target.value)} placeholder="Your answer..." maxLength={question.maxLength} />;
        case 'RATING':
            return (
                <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                            key={rating}
                            type="button"
                            variant={value === rating ? 'default' : 'outline'}
                            onClick={() => onChange(question.id, rating)}
                        >
                            {rating}
                        </Button>
                    ))}
                </div>
            );
        default:
            return null;
    }
} 