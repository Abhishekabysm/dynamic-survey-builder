'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../../lib/store';
import { 
  updateTitle, 
  updateDescription, 
  addQuestion,
  saveSurvey,
  reorderQuestions,
  createQuestion,
  updateQuestion,
  removeQuestion,
  setCurrentSurvey,
  Survey
} from '../../../../features/survey/surveySlice';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { QuestionType } from '../../../../features/survey/surveySlice';
import NewSortableQuestionItem from '../../../../components/survey/NewSortableQuestionItem';
import QuestionTypeSelector from '../../../../components/survey/QuestionTypeSelector';
import SurveyPreview from '../../../../components/survey/SurveyPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Plus } from 'lucide-react';

interface EditSurveyFormProps {
  survey: Survey;
}

export default function EditSurveyForm({ survey }: EditSurveyFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const { currentSurvey, isLoading } = useAppSelector((state) => state.survey);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(setCurrentSurvey(survey));
  }, [survey, dispatch]);

  const handleSaveSurvey = async () => {
    if (currentSurvey && user) {
      const result = await dispatch(saveSurvey(currentSurvey));
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/dashboard/surveys');
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && currentSurvey) {
      const oldIndex = currentSurvey.questions.findIndex((q) => q.id === active.id);
      const newIndex = currentSurvey.questions.findIndex((q) => q.id === over?.id);
      dispatch(reorderQuestions({ sourceIndex: oldIndex, destinationIndex: newIndex }));
    }
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentSurvey) {
    // This can happen briefly while the survey is being loaded into the store.
    // The parent page handles the main loading state.
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Edit Survey</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
          <Button onClick={handleSaveSurvey} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {!showPreview ? (
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Survey Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Survey Title</label>
                <Input
                  id="title"
                  value={currentSurvey.title}
                  onChange={(e) => dispatch(updateTitle(e.target.value))}
                  placeholder="My Awesome Survey"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={currentSurvey.description}
                  onChange={(e) => dispatch(updateDescription(e.target.value))}
                  placeholder="A short description of your survey..."
                  maxLength={500}
                  minRows={3}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {currentSurvey.description.length} / 500
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Questions</CardTitle></CardHeader>
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentSurvey.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {currentSurvey.questions.map((question) => (
                      <NewSortableQuestionItem
                        key={question.id}
                        question={question}
                        onUpdate={(q) => dispatch(updateQuestion(q))}
                        onRemove={(id) => dispatch(removeQuestion(id))}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Add a New Question</CardTitle></CardHeader>
            <CardContent className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <QuestionTypeSelector 
                selectedType={selectedQuestionType}
                onSelect={setSelectedQuestionType} 
              />
              <Button 
                onClick={() => dispatch(addQuestion(createQuestion(selectedQuestionType)))}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <SurveyPreview survey={currentSurvey} />
      )}
    </div>
  );
} 