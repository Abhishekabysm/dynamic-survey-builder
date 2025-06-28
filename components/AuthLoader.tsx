'use client';

import { useAppSelector } from '@/lib/store';
import Loader from './Loader';

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const { isInitialLoading } = useAppSelector((state) => state.auth);

  if (isInitialLoading) {
    return (
      <Loader />
    );
  }

  return <>{children}</>;
}
