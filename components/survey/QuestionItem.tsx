import { useState } from 'react';
import { Question, Option } from '../../features/survey/surveySlice';

interface QuestionItemProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: (questionId: string) => void;
}

export default function QuestionItem({ question, onUpdate, onRemove }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTextChange = (text: string) => {
    onUpdate({ ...question, text });
  };

  const toggleRequired = () => {
    onUpdate({ ...question, required: !question.required });
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    if (question.options) {
      const updatedOptions = question.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      );
      onUpdate({ ...question, options: updatedOptions });
    }
  };

  const addOption = () => {
    if (question.options) {
      const newOption: Option = {
        id: `option_${Date.now()}`,
        text: `Option ${question.options.length + 1}`
      };
      onUpdate({ ...question, options: [...question.options, newOption] });
    }
  };

  const removeOption = (optionId: string) => {
    if (question.options && question.options.length > 1) {
      const updatedOptions = question.options.filter((opt) => opt.id !== optionId);
      onUpdate({ ...question, options: updatedOptions });
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MULTIPLE_CHOICE: 'Multiple Choice',
      TEXT: 'Text Input',
      RATING: 'Rating Scale',
    };
    return labels[type] || 'Question';
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm transition-all">
      {/* Question Header */}
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <span className="text-sm font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {getQuestionTypeLabel(question.type)}
          </span>
          <h4 className="font-semibold text-gray-800 ml-3">{question.text || 'Untitled Question'}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(question.id); }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full"
            type="button"
            title="Remove Question"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-6">
          <div>
            <label htmlFor={`question-text-${question.id}`} className="block text-sm font-semibold text-gray-600 mb-1">
              Question
            </label>
            <input
              id={`question-text-${question.id}`}
              type="text"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. What is your favorite color?"
            />
          </div>

          {question.type === 'MULTIPLE_CHOICE' && question.options && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-600">
                Options
              </label>
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    className="block flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeOption(option.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full disabled:opacity-50 disabled:hover:text-gray-400"
                    type="button"
                    disabled={!question.options || question.options.length <= 1}
                    title="Remove Option"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                type="button"
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                Add another option
              </button>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={question.required}
                onChange={toggleRequired}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Required
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
} 