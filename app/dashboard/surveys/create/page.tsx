'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../../lib/store';
import { 
  initNewSurvey, 
  updateTitle, 
  updateDescription, 
  addQuestion,
  removeQuestion,
  updateQuestion,
  reorderQuestions,
  createQuestion,
  saveSurvey 
} from '../../../../features/survey/surveySlice';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Question, QuestionType, Option } from '../../../../features/survey/surveySlice';

// Import components 
import QuestionItem from '../../../../components/survey/QuestionItem';
import SortableQuestionItem from '../../../../components/survey/SortableQuestionItem';
import QuestionTypeSelector from '../../../../components/survey/QuestionTypeSelector';

export default function CreateSurvey() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const { currentSurvey, isLoading } = useAppSelector((state) => state.survey);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Initialize new survey if one doesn't exist
  useEffect(() => {
    if (user && !currentSurvey) {
      dispatch(initNewSurvey({ userId: user.uid }));
    }
  }, [user, currentSurvey, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && currentSurvey) {
      const oldIndex = currentSurvey.questions.findIndex((q) => q.id === active.id);
      const newIndex = currentSurvey.questions.findIndex((q) => q.id === over?.id);
      
      dispatch(reorderQuestions({ sourceIndex: oldIndex, destinationIndex: newIndex }));
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = createQuestion(selectedQuestionType);
    dispatch(addQuestion(newQuestion));
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    dispatch(updateQuestion(updatedQuestion));
  };

  const handleRemoveQuestion = (questionId: string) => {
    dispatch(removeQuestion(questionId));
  };

  const handleSaveSurvey = async () => {
    if (currentSurvey && user) {
      await dispatch(saveSurvey({
        ...currentSurvey,
        createdBy: user.uid
      }));
      router.push('/dashboard/surveys');
    }
  };

  if (!currentSurvey) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Create New Survey</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
          >
            {showPreview ? 'Edit Survey' : 'Preview'}
          </button>
          <button
            onClick={handleSaveSurvey}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Survey'}
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Survey Title
            </label>
            <input
              id="title"
              type="text"
              value={currentSurvey.title}
              onChange={(e) => dispatch(updateTitle(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter survey title"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={currentSurvey.description}
              onChange={(e) => dispatch(updateDescription(e.target.value))}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter survey description"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Questions</h3>

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
                      <SortableQuestionItem
                        key={question.id}
                        question={question}
                        onUpdate={handleUpdateQuestion}
                        onRemove={handleRemoveQuestion}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No questions added yet.</p>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="mb-3 sm:mb-0 sm:mr-4 sm:flex-grow">
                  <QuestionTypeSelector 
                    selectedType={selectedQuestionType} 
                    onSelect={setSelectedQuestionType} 
                  />
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">{currentSurvey.title}</h2>
            <p className="text-gray-600 mt-2">{currentSurvey.description}</p>
          </div>
          
          <div className="space-y-8">
            {currentSurvey.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="font-medium mb-2">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                
                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="ml-4 mt-3 space-y-2">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          id={`option_${option.id}`}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          disabled
                        />
                        <label htmlFor={`option_${option.id}`} className="ml-2 text-gray-700">
                          {option.text}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'TEXT' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your answer"
                      disabled
                    />
                  </div>
                )}
                
                {question.type === 'RATING' && (
                  <div className="flex mt-2 space-x-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
                        disabled
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 