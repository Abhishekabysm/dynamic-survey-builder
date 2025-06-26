import { useState } from 'react';
import { Question, Option } from '../../features/survey/surveySlice';

interface QuestionItemProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: (questionId: string) => void;
}

export default function QuestionItem({ question, onUpdate, onRemove }: QuestionItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleTextChange = (text: string) => {
    onUpdate({
      ...question,
      text
    });
  };

  const toggleRequired = () => {
    onUpdate({
      ...question,
      required: !question.required
    });
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    if (question.options) {
      const updatedOptions = question.options.map((opt) =>
        opt.id === optionId ? { ...opt, text } : opt
      );
      onUpdate({
        ...question,
        options: updatedOptions
      });
    }
  };

  const addOption = () => {
    if (question.options) {
      const newOption: Option = {
        id: `option_${Date.now()}`,
        text: `Option ${question.options.length + 1}`
      };
      onUpdate({
        ...question,
        options: [...question.options, newOption]
      });
    }
  };

  const removeOption = (optionId: string) => {
    if (question.options && question.options.length > 1) {
      const updatedOptions = question.options.filter((opt) => opt.id !== optionId);
      onUpdate({
        ...question,
        options: updatedOptions
      });
    }
  };

  return (
    <div className="border rounded-lg bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="mr-2 text-gray-500"
              type="button"
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            <span className="font-medium">{question.text || 'Untitled Question'}</span>
          </div>
          <div>
            <button
              onClick={() => onRemove(question.id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-4">
            <div>
              <label htmlFor={`question-text-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <input
                id={`question-text-${question.id}`}
                type="text"
                value={question.text}
                onChange={(e) => handleTextChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter question text"
              />
            </div>

            {question.type === 'MULTIPLE_CHOICE' && question.options && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <div className="mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                        className="block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeOption(option.id)}
                        className="ml-2 text-red-500 hover:bg-red-50 p-2 rounded-full"
                        type="button"
                        disabled={question.options && question.options.length <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Option
                </button>
              </div>
            )}

            {question.type === 'TEXT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Input Preview
                </label>
                <input
                  type="text"
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  placeholder="Text input field"
                />
              </div>
            )}

            {question.type === 'RATING' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Preview (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center mt-3">
              <input
                id={`required-${question.id}`}
                type="checkbox"
                checked={question.required}
                onChange={toggleRequired}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
                Required question
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 