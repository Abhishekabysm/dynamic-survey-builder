'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, BarChart, Edit, Share2 } from 'lucide-react';

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4 leading-tight">
              Create Stunning Surveys in Minutes
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build beautiful, interactive surveys and forms. Gather rich feedback and analyze your data with powerful, easy-to-use tools.
            </p>
            <div className="flex justify-center">
              {user ? (
                <Button size="lg" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="py-12 sm:py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                A powerful platform for all your data collection needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Edit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Easy Survey Creation</h3>
                <p className="text-gray-600">
                  Use our intuitive drag-and-drop builder to create engaging surveys. Choose from various question types and customize the design.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Simple Distribution</h3>
                <p className="text-gray-600">
                  Share your survey via a unique link. Our responsive design ensures it looks great on all devices, from desktops to smartphones.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Rich Analytics</h3>
                <p className="text-gray-600">
                  Analyze your results with beautiful charts and data visualizations. Gain valuable insights to make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
