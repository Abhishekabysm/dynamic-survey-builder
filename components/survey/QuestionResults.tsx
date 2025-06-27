'use client';

import { useState } from 'react';
import { Question, Option } from '@/features/survey/surveySlice';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart } from '@/components/ui/pie-chart';
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';

interface QuestionResultsProps {
  question: Question;
  answers: any[];
}

type ChartType = 'bar' | 'pie';

export default function QuestionResults({ question, answers }: QuestionResultsProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  
  const renderChartToggle = () => (
    <div className="flex justify-end mb-4">
      <Button variant={chartType === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('bar')} className="mr-2">
        <BarChart2 className="h-4 w-4" />
      </Button>
      <Button variant={chartType === 'pie' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('pie')}>
        <PieChartIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        const optionCounts: { [key: string]: number } = (question.options || []).reduce(
          (acc, option) => ({ ...acc, [option.text]: 0 }),
          {}
        );
        answers.forEach((answer) => {
          if (answer && optionCounts[answer] !== undefined) {
            optionCounts[answer]++;
          }
        });
        const chartData = Object.entries(optionCounts).map(([name, count]) => ({ name, value: count }));

        return (
          <div>
            {renderChartToggle()}
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} dataKey="value" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <PieChart data={chartData} />
            )}
          </div>
        );

      case 'RATING':
        const ratingCounts: { [key: string]: number } = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        let totalRating = 0;
        let ratingResponseCount = 0;

        answers.forEach((answer) => {
          const rating = String(answer);
          if (ratingCounts[rating] !== undefined) {
            ratingCounts[rating]++;
            totalRating += parseInt(rating, 10);
            ratingResponseCount++;
          }
        });
        
        const ratingChartData = Object.entries(ratingCounts).map(([name, count]) => ({ name: `${name} Star`, count }));
        const averageRating = ratingResponseCount > 0 ? (totalRating / ratingResponseCount).toFixed(2) : 'N/A';

        return (
          <div>
            <p className="text-lg font-semibold mb-4">Average Rating: {averageRating}</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'TEXT':
        return (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {answers.map((answer, index) => (
              <li key={index} className="p-3 bg-gray-50 border rounded-md">
                {String(answer)}
              </li>
            ))}
          </ul>
        );
      
      default:
        return <p>This question type cannot be analyzed.</p>;
    }
  };

  return <div className="py-4">{renderContent()}</div>;
} 