'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight,
  BarChart,
  Check,
  Edit,
  FileText,
  Lock,
  MousePointerClick,
  Paintbrush,
  Share2,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: <MousePointerClick className="h-8 w-8 text-blue-600" />,
    title: 'Drag-and-Drop Builder',
    description:
      'Easily create and arrange questions with our intuitive drag-and-drop interface.',
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: 'Multiple Question Types',
    description:
      'Choose from a variety of question types, including multiple choice, text, and ratings.',
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-600" />,
    title: 'Real-time Response Tracking',
    description:
      'Monitor your survey responses as they come in with our live dashboard.',
  },
  {
    icon: <Paintbrush className="h-8 w-8 text-blue-600" />,
    title: 'Customizable Themes',
    description:
      'Customize the look and feel of your surveys to match your brand.',
  },
  {
    icon: <Share2 className="h-8 w-8 text-blue-600" />,
    title: 'Data Export Options',
    description:
      'Export your survey data to CSV or other formats for further analysis.',
  },
  {
    icon: <Lock className="h-8 w-8 text-blue-600" />,
    title: 'Secure and Reliable',
    description:
      'Your data is safe with us. We use the latest security measures to protect your information.',
  },
];

const pricingTiers = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'For individuals and small teams just getting started.',
    features: [
      'Up to 3 surveys',
      '100 responses per survey',
      'Basic question types',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$29',
    pricePeriod: '/ month',
    description: 'For growing teams that need more power and customization.',
    features: [
      'Unlimited surveys',
      'Unlimited responses',
      'Advanced question types',
      'Custom branding',
      'Priority email support',
    ],
    cta: 'Choose Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    description:
      'For large organizations with advanced security and support needs.',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Single Sign-On (SSO)',
      'Advanced security features',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];

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
              Build beautiful, interactive surveys and forms. Gather rich
              feedback and analyze your data with powerful, easy-to-use tools.
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

        <section id="features" className="py-12 sm:py-16 lg:py-24 bg-gray-50/90">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                Everything you need to create engaging surveys and gather
                valuable insights.
              </p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                Choose the plan that's right for you.
              </p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`flex flex-col ${
                    tier.popular ? 'border-blue-600' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.pricePeriod && (
                        <span className="text-gray-500">
                          {tier.pricePeriod}
                        </span>
                      )}
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">{tier.cta}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-12 sm:py-16 lg:py-24 bg-gray-50/90">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                About SurveyBuilder
              </h2>
              <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                We are a company dedicated to making survey building easy and
                intuitive for everyone.
              </p>
            </div>
            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our mission is to empower businesses, researchers, and
                    individuals to create beautiful, effective surveys without
                    needing any technical skills. We believe that gathering
                    feedback should be a simple and enjoyable process.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We are a passionate team of designers, developers, and product
                    thinkers who are obsessed with creating the best possible user
                    experience. We are fully remote and dedicated to building a
                    tool that our customers love.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
