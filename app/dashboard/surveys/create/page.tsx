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
  saveSurvey,
  clearCurrentSurvey
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
import { Question, QuestionType } from '../../../../features/survey/surveySlice';
import SortableQuestionItem from '../../../../components/survey/SortableQuestionItem';
import QuestionTypeSelector from '../../../../components/survey/QuestionTypeSelector';

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

  if (!currentSurvey) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {currentSurvey.id ? 'Edit Survey' : 'Create New Survey'}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-sm"
          >
            {showPreview ? 'Editor' : 'Preview'}
          </button>
          <button
            onClick={handleSaveSurvey}
            disabled={isLoading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Survey'}
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="space-y-8">
          {/* Survey Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Survey Title
              </label>
              <input
                id="title"
                type="text"
                value={currentSurvey.title}
                onChange={(e) => dispatch(updateTitle(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Awesome Survey"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={currentSurvey.description}
                onChange={(e) => dispatch(updateDescription(e.target.value))}
                rows={3}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A short description of your survey..."
              />
            </div>
          </div>
          
          {/* Questions Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions</h2>
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
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <p className="mt-4 text-sm font-medium text-gray-600">No questions added yet. Start by selecting a question type below.</p>
              </div>
            )}
          </div>
          
          {/* Add Question Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <QuestionTypeSelector 
              selectedType={selectedQuestionType} 
              onSelect={setSelectedQuestionType} 
            />
            <div className="mt-6 text-right">
              <button
                onClick={handleAddQuestion}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Question
              </button>
            </div>
          </div>

        </div>
      ) : (
        // Preview Mode
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{currentSurvey.title}</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{currentSurvey.description}</p>
          </div>
          
          <div className="space-y-8 max-w-2xl mx-auto">
            {currentSurvey.questions.length > 0 ? (
              currentSurvey.questions.map((question, index) => (
                <div key={question.id} className="p-5 border rounded-lg bg-gray-50">
                  <div className="font-semibold text-lg text-gray-800 mb-3">
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
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
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
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">This survey has no questions to preview.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 