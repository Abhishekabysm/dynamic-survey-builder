import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../features/survey/surveySlice';
import QuestionItem from './QuestionItem';

interface SortableQuestionItemProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: (questionId: string) => void;
}

export default function SortableQuestionItem({ 
  question, 
  onUpdate, 
  onRemove 
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <div className="flex">
        <div
          className="px-2 py-4 cursor-move flex items-center"
          {...attributes}
          {...listeners}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="flex-grow">
          <QuestionItem
            question={question}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        </div>
      </div>
    </div>
  );
} 