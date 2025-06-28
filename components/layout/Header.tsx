'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { logoutUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const sections = ['features', 'pricing', 'about'];
    const headerHeight = 80; // Height of the sticky header

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = 'home';

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - headerHeight;
          if (scrollY >= sectionTop) {
            current = id;
          }
        }
      }

      // Check if user has scrolled to the very bottom
      if (window.innerHeight + scrollY >= document.body.offsetHeight - 2) {
        current = 'about';
      }
      
      setActiveLink(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active link

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/');
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const hash = new URL(href).hash;

    if (hash) {
      const targetId = hash.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({
          behavior: 'smooth',
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 left-0 w-full z-30">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-blue-900"
        >
          SurveyBuilder
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Button variant={activeLink === 'home' ? 'default' : 'ghost'} asChild>
            <Link href="/" onClick={handleScroll}>
              Home
            </Link>
          </Button>
          <Button variant={activeLink === 'features' ? 'default' : 'ghost'} asChild>
            <Link href="/#features" onClick={handleScroll}>
              Features
            </Link>
          </Button>
          <Button variant={activeLink === 'pricing' ? 'default' : 'ghost'} asChild>
            <Link href="/#pricing" onClick={handleScroll}>
              Pricing
            </Link>
          </Button>
          <Button variant={activeLink === 'about' ? 'default' : 'ghost'} asChild>
            <Link href="/#about" onClick={handleScroll}>
              About
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                onMouseEnter={() => router.prefetch('/dashboard')}
                className="text-xs md:text-sm"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                className="text-xs md:text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login" onMouseEnter={() => router.prefetch('/login')}>
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link
                  href="/register"
                  onMouseEnter={() => router.prefetch('/register')}
                >
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}; 