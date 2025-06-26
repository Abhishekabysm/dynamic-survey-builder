import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { Survey } from '../survey/surveySlice';

// Types
export interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: string | string[] | number | null; // Can be text, array of selected options, or rating
}

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  respondentId?: string; // Optional if anonymous
  responses: QuestionResponse[];
  submittedAt: number;
}

interface ResponseState {
  responses: SurveyResponse[];
  currentSurveyResponses: SurveyResponse[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial state
const initialState: ResponseState = {
  responses: [],
  currentSurveyResponses: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const submitSurveyResponse = createAsyncThunk(
  'response/submitSurveyResponse',
  async (surveyResponse: SurveyResponse, { rejectWithValue }) => {
    try {
      const newResponse = {
        ...surveyResponse,
        submittedAt: Date.now()
      };
      
      const docRef = await addDoc(collection(firestore, 'responses'), newResponse);
      return {
        ...newResponse,
        id: docRef.id
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit survey response');
    }
  }
);

export const fetchSurveyResponses = createAsyncThunk(
  'response/fetchSurveyResponses',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const responsesRef = collection(firestore, 'responses');
      const q = query(responsesRef, where('surveyId', '==', surveyId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SurveyResponse[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch survey responses');
    }
  }
);

// Analytics functions
export const calculateResponseStats = (survey: Survey, responses: SurveyResponse[]) => {
  const stats: Record<string, any> = {};
  
  if (!survey || !survey.questions || responses.length === 0) {
    return stats;
  }
  
  survey.questions.forEach(question => {
    const questionId = question.id;
    
    // Collect all answers for this question
    const answers = responses
      .map(response => {
        const questionResponse = response.responses.find(r => r.questionId === questionId);
        return questionResponse ? questionResponse.answer : null;
      })
      .filter(answer => answer !== null); // Filter out null answers
      
    if (question.type === 'MULTIPLE_CHOICE') {
      // Count occurrences of each option
      const optionCounts: Record<string, number> = {};
      
      answers.forEach(answer => {
        if (Array.isArray(answer)) {
          // Handle checkbox (multiple selection)
          answer.forEach(option => {
            optionCounts[option] = (optionCounts[option] || 0) + 1;
          });
        } else if (typeof answer === 'string') {
          // Handle radio (single selection)
          optionCounts[answer] = (optionCounts[answer] || 0) + 1;
        }
      });
      
      stats[questionId] = {
        type: 'MULTIPLE_CHOICE',
        optionCounts,
        total: answers.length
      };
    } else if (question.type === 'RATING') {
      // Calculate average rating
      const numericAnswers = answers
        .filter(answer => typeof answer === 'number') as number[];
        
      const sum = numericAnswers.reduce((acc, curr) => acc + curr, 0);
      const average = numericAnswers.length > 0 ? sum / numericAnswers.length : 0;
      
      stats[questionId] = {
        type: 'RATING',
        average,
        total: numericAnswers.length,
        distribution: [1, 2, 3, 4, 5].map(rating => ({
          rating,
          count: numericAnswers.filter(a => a === rating).length
        }))
      };
    } else if (question.type === 'TEXT') {
      // Simply collect all text responses
      stats[questionId] = {
        type: 'TEXT',
        responses: answers.filter(answer => typeof answer === 'string'),
        total: answers.length
      };
    }
  });
  
  return stats;
};

// Slice
const responseSlice = createSlice({
  name: 'response',
  initialState,
  reducers: {
    clearResponseData: (state) => {
      state.currentSurveyResponses = [];
      state.error = null;
      state.successMessage = null;
    },
    clearResponseMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit response
      .addCase(submitSurveyResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitSurveyResponse.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Survey response submitted successfully!';
      })
      .addCase(submitSurveyResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch responses
      .addCase(fetchSurveyResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurveyResponses = action.payload;
      })
      .addCase(fetchSurveyResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResponseData, clearResponseMessages } = responseSlice.actions;
export default responseSlice.reducer; 