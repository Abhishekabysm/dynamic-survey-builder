'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question, Option } from '../../features/survey/surveySlice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface SortableQuestionItemProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: (questionId: string) => void;
}

export default function NewSortableQuestionItem({ question, onUpdate, onRemove }: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTextChange = (text: string) => onUpdate({ ...question, text });
  const toggleRequired = () => onUpdate({ ...question, required: !question.required });

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

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <Button variant="ghost" {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-5 w-5" />
      </Button>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={question.id}>
          <AccordionTrigger>{question.text || 'Untitled Question'}</AccordionTrigger>
          <AccordionContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={`question-text-${question.id}`}>Question Text</Label>
              <Input
                id={`question-text-${question.id}`}
                value={question.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="e.g. What is your favorite color?"
              />
            </div>

            {question.type === 'MULTIPLE_CHOICE' && question.options && (
              <div className="space-y-3">
                <Label>Options</Label>
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      disabled={question.options && question.options.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={toggleRequired}
                />
                <Label htmlFor={`required-${question.id}`}>Required</Label>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onRemove(question.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove Question
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 