'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { auth } from '../firebase/config';
import { onAuthStateChanged, User, sendEmailVerification } from 'firebase/auth';
import { setUser, setLoading } from '../features/auth/authSlice';

// A map to track if a verification email has been sent for a user ID
const verificationEmailSent = new Map<string, boolean>();

const handleUserSession = async (user: User | null) => {
  store.dispatch(setLoading(true));

  if (user) {
    // If the user is new and their email is not verified, send the verification link.
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    
    if (isNewUser && !user.emailVerified && !verificationEmailSent.has(user.uid)) {
      try {
        await sendEmailVerification(user);
        console.log(`Verification email sent to ${user.email}`);
        verificationEmailSent.set(user.uid, true); // Mark as sent to prevent re-sending on hot-reload
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
    }
    
    // Update the Redux store with the user's current state.
    store.dispatch(setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }));
  } else {
    // If no user is logged in, clear the user state.
    store.dispatch(setUser(null));
  }
  
  store.dispatch(setLoading(false));
};

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, handleUserSession);
    
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
} 