'use client';

import { useAppSelector } from '@/lib/store';
import Loader from './Loader';

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return <>{children}</>;
}
