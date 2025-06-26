'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '../features/auth/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      store.dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
} 