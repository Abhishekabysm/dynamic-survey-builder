'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onSelect: (type: QuestionType) => void;
  selectedType: QuestionType;
}

export default function QuestionTypeSelector({ onSelect, selectedType }: QuestionTypeSelectorProps) {
  return (
    <Select onValueChange={onSelect} value={selectedType}>
      <SelectTrigger>
        <SelectValue placeholder="Select a question type" />
      </SelectTrigger>
      <SelectContent>
        {questionTypeDetails.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 