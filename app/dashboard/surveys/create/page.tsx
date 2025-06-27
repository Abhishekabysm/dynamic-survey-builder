'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../../lib/store';
import { 
  initNewSurvey, 
  updateTitle, 
  updateDescription, 
  addQuestion,
  saveSurvey,
  clearCurrentSurvey,
  reorderQuestions,
  createQuestion,
  updateQuestion,
  removeQuestion
} from '../../../../features/survey/surveySlice';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Question, QuestionType } from '../../../../features/survey/surveySlice';
import NewSortableQuestionItem from '../../../../components/survey/NewSortableQuestionItem';
import QuestionTypeSelector from '../../../../components/survey/QuestionTypeSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, ChevronsUpDown, GripVertical, Plus, Trash2 } from 'lucide-react';

export default function CreateSurvey() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const { currentSurvey, isLoading } = useAppSelector((state) => state.survey);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user && !currentSurvey) {
      dispatch(initNewSurvey({ userId: user.uid }));
    }
  }, [user, currentSurvey, dispatch]);

  const handleSaveSurvey = async () => {
    if (currentSurvey && user) {
      const result = await dispatch(saveSurvey({
        ...currentSurvey,
        createdBy: user.uid
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(clearCurrentSurvey());
        router.push('/dashboard');
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {currentSurvey.id ? 'Edit Survey' : 'Create New Survey'}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
          <Button onClick={handleSaveSurvey} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Survey'}
          </Button>
        </div>
      </div>

      {!showPreview ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Survey Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Survey Title
                </label>
                <Input
                  id="title"
                  type="text"
                  value={currentSurvey.title}
                  onChange={(e) => dispatch(updateTitle(e.target.value))}
                  placeholder="Untitled Survey"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={currentSurvey.description}
                  onChange={(e) => dispatch(updateDescription(e.target.value))}
                  rows={3}
                  placeholder="A short description of your survey..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {currentSurvey.questions.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentSurvey.questions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {currentSurvey.questions.map((question) => (
                        <NewSortableQuestionItem
                          key={question.id}
                          question={question}
                          onUpdate={(updatedQuestion) => dispatch(updateQuestion(updatedQuestion))}
                          onRemove={() => dispatch(removeQuestion(question.id))}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-10 bg-muted rounded-lg border-2 border-dashed">
                  <p className="mt-4 text-sm font-medium">No questions added yet. Start by selecting a question type below.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add a New Question</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <QuestionTypeSelector 
                selectedType={selectedQuestionType}
                onSelect={setSelectedQuestionType} 
              />
              <Button onClick={() => dispatch(addQuestion(createQuestion(selectedQuestionType)))}>
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Survey Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Implement survey preview here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 