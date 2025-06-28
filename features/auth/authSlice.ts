'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';

// A serializable user object
interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  isInitialLoading: boolean; // For the initial auth check on app load
  isActionLoading: boolean; // For login, register, logout actions
  error: string | null;
  needsEmailVerification: boolean; // This will be set by the onAuthStateChanged listener
  verificationEmailSent: boolean;
}

const initialState: AuthState = {
  user: null,
  isInitialLoading: true,
  isActionLoading: false,
  error: null,
  needsEmailVerification: false,
  verificationEmailSent: false,
};

// Just creates the user. The listener in providers.tsx will handle the rest.
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will pick up the new user.
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Just signs the user in. The listener in providers.tsx will handle the rest.
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will pick up the logged-in user.
      return null;
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        return rejectWithValue('Invalid email or password. Please try again.');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await signOut(auth);
});

// Renamed to be more descriptive. This just re-sends the link.
export const resendVerificationLink = createAsyncThunk(
  'auth/resendVerificationLink',
  async (_, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        return true;
      }
      return rejectWithValue('No user is currently signed in.');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      state.user = action.payload;
      if(action.payload) {
        state.needsEmailVerification = !action.payload.emailVerified;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isActionLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isActionLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isActionLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isActionLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isActionLoading = false;
        // Handle logout error if needed
      })
      // Resend Verification
      .addCase(resendVerificationLink.pending, (state) => {
        state.verificationEmailSent = false;
        state.error = null;
      })
      .addCase(resendVerificationLink.fulfilled, (state) => {
        state.verificationEmailSent = true;
      })
      .addCase(resendVerificationLink.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setError, setInitialLoading, setLoading } = authSlice.actions;

export default authSlice.reducer; 