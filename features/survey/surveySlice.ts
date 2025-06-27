import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { firestore } from '../../firebase/config';

// Types
export type QuestionType = 'MULTIPLE_CHOICE' | 'TEXT' | 'RATING';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: Option[]; // For multiple choice questions
  maxLength?: number; // For text questions
}

export interface Survey {
  id?: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
  isPublished: boolean;
}

interface SurveyState {
  surveys: Survey[];
  currentSurvey: Survey | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: SurveyState = {
  surveys: [],
  currentSurvey: null,
  isLoading: false,
  error: null,
};

// Helper function to create a new question
export const createQuestion = (type: QuestionType): Question => {
  return {
    id: `question_${Date.now()}`,
    type,
    text: '',
    required: false,
    options: type === 'MULTIPLE_CHOICE' ? [
      { id: `option_${Date.now()}_1`, text: 'Option 1' },
      { id: `option_${Date.now()}_2`, text: 'Option 2' }
    ] : undefined,
  };
};

// Async thunks
export const fetchUserSurveys = createAsyncThunk(
  'survey/fetchUserSurveys',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('fetchUserSurveys: Querying for userId:', userId);
      const surveysRef = collection(firestore, 'surveys');
      const q = query(surveysRef, where('createdBy', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const surveys = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Survey[];

      console.log('fetchUserSurveys: Found surveys:', surveys.length);
      return surveys;
    } catch (error: any) {
      console.error('fetchUserSurveys: Error fetching surveys', error);
      return rejectWithValue(error.message || 'Failed to fetch surveys');
    }
  }
);

export const fetchSurveyById = createAsyncThunk(
  'survey/fetchSurveyById',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const surveyRef = doc(firestore, 'surveys', surveyId);
      const surveyDoc = await getDoc(surveyRef);
      
      if (!surveyDoc.exists()) {
        throw new Error('Survey not found');
      }
      
      return {
        id: surveyDoc.id,
        ...surveyDoc.data()
      } as Survey;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch survey');
    }
  }
);

export const saveSurvey = createAsyncThunk(
  'survey/saveSurvey',
  async (survey: Survey, { rejectWithValue }) => {
    try {
      let savedSurvey: Survey;
      
      if (survey.id) {
        // Update existing survey
        const surveyRef = doc(firestore, 'surveys', survey.id);
        await updateDoc(surveyRef, {
          ...survey,
          updatedAt: Date.now()
        });
        savedSurvey = {
          ...survey,
          updatedAt: Date.now()
        };
      } else {
        // Create new survey
        const newSurvey = {
          ...survey,
          createdAt: Date.now(),
          isPublished: false
        };
        const docRef = await addDoc(collection(firestore, 'surveys'), newSurvey);
        savedSurvey = {
          ...newSurvey,
          id: docRef.id
        };
      }
      
      return savedSurvey;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save survey');
    }
  }
);

export const publishSurvey = createAsyncThunk(
  'survey/publishSurvey',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const surveyRef = doc(firestore, 'surveys', surveyId);
      await updateDoc(surveyRef, {
        isPublished: true
      });
      
      return surveyId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to publish survey');
    }
  }
);

export const deleteSurvey = createAsyncThunk(
  'survey/deleteSurvey',
  async (surveyId: string, { rejectWithValue }) => {
    try {
      const surveyRef = doc(firestore, 'surveys', surveyId);
      await deleteDoc(surveyRef);
      return surveyId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete survey');
    }
  }
);

// Slice
const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    initNewSurvey: (state, action: PayloadAction<{ userId: string }>) => {
      state.currentSurvey = {
        title: 'Untitled Survey',
        description: '',
        questions: [],
        createdBy: action.payload.userId,
        createdAt: Date.now(),
        isPublished: false,
      };
    },
    setCurrentSurvey: (state, action: PayloadAction<Survey | null>) => {
      state.currentSurvey = action.payload;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
      if (state.currentSurvey) {
        state.currentSurvey.title = action.payload;
      }
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      if (state.currentSurvey) {
        state.currentSurvey.description = action.payload;
      }
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      if (state.currentSurvey) {
        state.currentSurvey.questions.push(action.payload);
      }
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      if (state.currentSurvey) {
        const index = state.currentSurvey.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.currentSurvey.questions[index] = action.payload;
        }
      }
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      if (state.currentSurvey) {
        state.currentSurvey.questions = state.currentSurvey.questions.filter(
          q => q.id !== action.payload
        );
      }
    },
    reorderQuestions: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      if (state.currentSurvey) {
        const { sourceIndex, destinationIndex } = action.payload;
        const questions = [...state.currentSurvey.questions];
        const [movedQuestion] = questions.splice(sourceIndex, 1);
        questions.splice(destinationIndex, 0, movedQuestion);
        state.currentSurvey.questions = questions;
      }
    },
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null;
    },
    clearSurveyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user surveys
      .addCase(fetchUserSurveys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSurveys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveys = action.payload;
      })
      .addCase(fetchUserSurveys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single survey
      .addCase(fetchSurveyById.pending, (state) => {
        state.isLoading = true;
        state.currentSurvey = null;
        state.error = null;
      })
      .addCase(fetchSurveyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurvey = action.payload;
      })
      .addCase(fetchSurveyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Save survey
      .addCase(saveSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurvey = action.payload;
        
        // Update surveys list if needed
        const index = state.surveys.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.surveys[index] = action.payload;
        } else {
          state.surveys.push(action.payload);
        }
      })
      .addCase(saveSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Publish survey
      .addCase(publishSurvey.fulfilled, (state, action) => {
        const surveyId = action.payload;
        
        // Update current survey if it's the one being published
        if (state.currentSurvey && state.currentSurvey.id === surveyId) {
          state.currentSurvey.isPublished = true;
        }
        
        // Update in surveys list
        const index = state.surveys.findIndex(s => s.id === surveyId);
        if (index !== -1) {
          state.surveys[index].isPublished = true;
        }
      })
      // Delete survey
      .addCase(deleteSurvey.fulfilled, (state, action) => {
        const surveyId = action.payload;
        state.surveys = state.surveys.filter(s => s.id !== surveyId);
        
        if (state.currentSurvey && state.currentSurvey.id === surveyId) {
          state.currentSurvey = null;
        }
      });
  },
});

export const {
  initNewSurvey,
  setCurrentSurvey,
  updateTitle,
  updateDescription,
  addQuestion,
  updateQuestion,
  removeQuestion,
  reorderQuestions,
  clearCurrentSurvey,
  clearSurveyError,
} = surveySlice.actions;

export default surveySlice.reducer; 