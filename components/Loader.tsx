'use client';

import { PuffLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <PuffLoader color="#4A90E2" />
    </div>
  );
};

export default Loader;
