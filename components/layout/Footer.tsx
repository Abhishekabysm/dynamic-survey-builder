'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { Navigation } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-gray-50 border-t pt-12 pb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button
          size="icon"
          className="rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Navigation className="h-6 w-6 text-blue-900" />
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SurveyBuilder. All rights
              reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-blue-900"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-blue-900"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 