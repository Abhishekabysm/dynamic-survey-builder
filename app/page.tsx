'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart,
  Check,
  Edit,
  FileText,
  Heart,
  Lock,
  MousePointerClick,
  Paintbrush,
  Rocket,
  Share2,
  Users,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

const aboutContent = [
  {
    icon: <Rocket className="h-8 w-8 text-blue-600" />,
    title: 'Our Mission',
    description:
      'To provide the best tools for creating effective and beautiful surveys.',
  },
  {
    icon: <Heart className="h-8 w-8 text-blue-600" />,
    title: 'Our Vision',
    description:
      'A world where feedback is seamless, enabling continuous improvement for all.',
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: 'Our Team',
    description:
      'Passionate creators dedicated to crafting the ultimate survey-building experience.',
  },
];

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <section className="relative w-full overflow-hidden bg-white">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#dbeafe,transparent)]" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-x-12 gap-y-16 py-24 lg:min-h-screen lg:grid-cols-2 lg:py-0">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-blue-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Create Stunning Surveys in Minutes
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-gray-700 md:text-xl lg:mx-0">
                  Build beautiful, interactive surveys and forms. Gather rich
                  feedback and analyze your data with powerful, easy-to-use
                  tools.
                </p>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  {user ? (
                    <Button
                      size="lg"
                      onClick={() => router.push('/dashboard')}
                      className="shadow-lg transition-shadow hover:shadow-xl"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      asChild
                      className="shadow-lg transition-shadow hover:shadow-xl"
                    >
                      <Link href="/register">
                        Get Started for Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div
                className="flex items-center justify-center relative"
                aria-hidden="true"
              >
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full -z-10" />
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gray-100 rounded-full -z-10" />
                  <Card className="transform-gpu -rotate-2 transition-transform duration-500 hover:rotate-0 focus-within:rotate-0 sm:-rotate-6 shadow-2xl">
                    <CardHeader>
                      <CardTitle>New Survey</CardTitle>
                      <CardDescription>
                        What would you like to ask?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="q1">
                          What is your favorite feature?
                        </Label>
                        <Input
                          id="q1"
                          placeholder="e.g., Drag-and-drop builder"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>How likely are you to recommend us?</Label>
                        <RadioGroup
                          defaultValue="4"
                          className="flex justify-between pt-2"
                        >
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center space-y-2"
                            >
                              <RadioGroupItem
                                value={String(i + 1)}
                                id={`r${i + 1}`}
                              />
                              <Label
                                htmlFor={`r${i + 1}`}
                                className="text-xs"
                              >
                                {i + 1}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 sm:py-16 lg:py-24 bg-gray-50/90">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl md:text-4xl">
                Powerful Features
              </h2>
              <p className="text-base text-gray-600 sm:text-lg mt-2 max-w-3xl mx-auto">
                Everything you need to create engaging surveys and gather
                valuable insights.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:bg-gray-950"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100 dark:bg-gray-800 dark:group-hover:bg-blue-900">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-blue-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-blue-900 sm:text-3xl md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="text-base text-gray-600 sm:text-lg mt-2 max-w-3xl mx-auto">
                Choose the plan that's right for you.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col rounded-2xl border p-8 shadow-lg ${
                    tier.popular
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <h3 className="text-lg font-semibold leading-5 text-blue-900">
                    {tier.name}
                  </h3>
                  {tier.popular && (
                    <p className="absolute top-0 -translate-y-1/2 transform rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </p>
                  )}
                  <p className="mt-4 text-sm text-gray-600">
                    {tier.description}
                  </p>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    {tier.pricePeriod && (
                      <span className="ml-1 text-xl font-semibold">
                        {tier.pricePeriod}
                      </span>
                    )}
                  </div>
                  <ul role="list" className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-blue-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Button
                      className="w-full"
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl">
                About SurveyBuilder
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We are committed to building custom solutions that drive
                business success.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                  alt="Our team working together"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="text-gray-700 space-y-6">
                <p>
                  At SurveyBuilder, we specialize in crafting bespoke online
                  solutions tailored to elevate businesses toward their digital
                  objectives. We are committed to continuous evolution and stay
                  abreast of cutting-edge web technologies and trends to ensure
                  a constant delivery of unparalleled excellence.
                </p>
                <p>
                  Our ethos is rooted in equipping clients with the essential
                  tools for triumph in the digital realm. We firmly believe in
                  furnishing every business with a digital presence that
                  authentically embodies their brand essence and effectively
                  resonates with their target demographic.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/#pricing')}
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
