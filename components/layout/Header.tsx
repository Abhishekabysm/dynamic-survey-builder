'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { logoutUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/');
  };

  return (
    <header className="bg-transparent absolute top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          SurveyBuilder
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-gray-600 hover:text-blue-900">
            Features
          </Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-blue-900">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-900">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 