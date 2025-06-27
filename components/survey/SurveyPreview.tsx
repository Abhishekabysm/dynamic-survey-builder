'use client';

import { Survey, Question } from '@/features/survey/surveySlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface SurveyPreviewProps {
  survey: Survey;
}

export default function SurveyPreview({ survey }: SurveyPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>{survey.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {survey.questions.map((question, index) => (
          <div key={question.id}>
            <p className="font-semibold">
              {index + 1}. {question.text}
              {question.required && <span className="text-destructive ml-1">*</span>}
            </p>
            <div className="mt-4">
              {question.type === 'MULTIPLE_CHOICE' && (
                <RadioGroup>
                  {question.options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type === 'TEXT' && (
                <Input type="text" placeholder="Your answer" />
              )}
              {question.type === 'RATING' && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button key={rating} variant="outline" size="icon">
                      {rating}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
} 