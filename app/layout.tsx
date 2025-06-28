import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { AuthHandler } from '../components/AuthHandler';
import AuthLoader from '../components/AuthLoader';
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dynamic Survey Builder',
  description: 'Create and manage interactive surveys with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Providers>
                    <AuthLoader>
            <AuthHandler />
            {children}
            <Toaster richColors position="top-right" />
          </AuthLoader>
        </Providers>
      </body>
    </html>
  );
}
