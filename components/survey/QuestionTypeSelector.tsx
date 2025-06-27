import { QuestionType } from '../../features/survey/surveySlice';

// Icons for different question types
const MultipleChoiceIcon = () => (
  <svg className="h-6 w-6 mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const TextIcon = () => (
  <svg className="h-6 w-6 mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const RatingIcon = () => (
  <svg className="h-6 w-6 mb-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const questionTypeDetails = [
  {
    value: 'MULTIPLE_CHOICE' as QuestionType,
    label: 'Multiple Choice',
    description: 'Options, checkboxes, lists.',
    icon: <MultipleChoiceIcon />,
  },
  {
    value: 'TEXT' as QuestionType,
    label: 'Text',
    description: 'Short or long form answers.',
    icon: <TextIcon />,
  },
  {
    value: 'RATING' as QuestionType,
    label: 'Rating',
    description: 'A 1-5 star rating scale.',
    icon: <RatingIcon />,
  },
];

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onSelect: (type: QuestionType) => void;
}

export default function QuestionTypeSelector({ selectedType, onSelect }: QuestionTypeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Question Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questionTypeDetails.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onSelect(type.value)}
            className={`p-6 text-left border rounded-xl transition-all duration-200 ${
              selectedType === type.value
                ? 'bg-white ring-2 ring-blue-500 shadow-lg'
                : 'bg-gray-50 hover:bg-white hover:shadow-md'
            }`}
          >
            {type.icon}
            <h4 className="text-base font-bold text-gray-900">{type.label}</h4>
            <p className="text-sm text-gray-500 mt-1">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 