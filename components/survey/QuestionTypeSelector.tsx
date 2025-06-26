import { QuestionType } from '../../features/survey/surveySlice';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onSelect: (type: QuestionType) => void;
}

const questionTypes: { value: QuestionType; label: string; description: string }[] = [
  {
    value: 'MULTIPLE_CHOICE',
    label: 'Multiple Choice',
    description: 'Radio buttons or checkboxes for selecting options'
  },
  {
    value: 'TEXT',
    label: 'Text',
    description: 'Short or long text input'
  },
  {
    value: 'RATING',
    label: 'Rating',
    description: '1-5 rating scale'
  }
];

export default function QuestionTypeSelector({ selectedType, onSelect }: QuestionTypeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Question Type
      </label>
      <div className="flex flex-wrap gap-3">
        {questionTypes.map((type) => (
          <button
            key={type.value}
            className={`flex-1 p-3 border rounded-lg text-left min-w-[120px] ${
              selectedType === type.value
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(type.value)}
            type="button"
          >
            <div className="font-medium">{type.label}</div>
            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
} 