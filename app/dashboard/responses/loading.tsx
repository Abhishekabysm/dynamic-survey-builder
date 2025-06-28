'use client';

import { PuffLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <PuffLoader color="#4A90E2" />
    </div>
  );
}
