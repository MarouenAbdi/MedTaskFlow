import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  TrendingUp,
  Brain,
  LayoutGrid,
  LineChart,
  Shield,
  Timer,
  HeartPulse,
  Smile,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Eliminate Scheduling Chaos",
    description: "AI-powered scheduling that prevents errors and maximizes efficiency."
  },
  {
    icon: Clock,
    title: "Reclaim Your Time",
    description: "Automate administrative tasks and focus on patient care."
  },
  {
    icon: TrendingUp,
    title: "Optimize Your Practice",
    description: "Data-driven insights for smarter healthcare decisions."
  }
];

const keyFeatures = [
  {
    icon: Brain,
    title: "AI-Driven Automation",
    description: "Smart automation handles repetitive tasks, reducing manual work by 75%"
  },
  {
    icon: LayoutGrid,
    title: "Centralized Management",
    description: "All your tasks and patient data in one secure, organized hub"
  },
  {
    icon: LineChart,
    title: "Productivity Analytics",
    description: "Real-time insights to optimize your workflow and efficiency"
  },
  {
    icon: Shield,
    title: "HIPAA Compliance",
    description: "Enterprise-grade security ensuring patient data protection"
  }
];

const benefits = [
  {
    icon: Timer,
    title: "Save Precious Time",
    description: "Reduce administrative work by 40% through smart automation"
  },
  {
    icon: Sparkles,
    title: "Reduce Daily Stress",
    description: "Streamlined workflows eliminate administrative burden"
  },
  {
    icon: HeartPulse,
    title: "Enhanced Patient Care",
    description: "More time and focus for what matters most - your patients"
  },
  {
    icon: Smile,
    title: "Work-Life Balance",
    description: "Finish your day on time with optimized scheduling"
  }
];

const testimonials = [
  {
    quote: "MedTaskFlow has revolutionized how we manage our practice. It's intuitive and saves us hours every week.",
    author: "Dr. Sarah Johnson",
    role: "Family Physician",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    location: "New York Medical Center"
  },
  {
    quote: "The best investment we've made for our clinic. Patient management has never been easier.",
    author: "Dr. Michael Chen",
    role: "Pediatrician",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
    location: "Children's Wellness Clinic"
  },
  {
    quote: "Outstanding support and constant improvements. This is exactly what modern healthcare needs.",
    author: "Dr. Emily Rodriguez",
    role: "Cardiologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
    location: "Heart Care Institute"
  }
];

export function Landing() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container px-4 mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-2xl font-bold">{t('app.name')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 dark:from-background dark:to-background/95">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Streamline Your Medical Practice
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  The all-in-one solution for modern healthcare providers. Manage patients, appointments, and records with ease.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <img
                alt="Medical dashboard interface"
                className="w-full rounded-lg border bg-white shadow-2xl dark:hidden md:w-[600px]"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
              />
              <img
                alt="Medical dashboard interface"
                className="hidden w-full rounded-lg border bg-gray-900 shadow-2xl dark:block md:w-[600px]"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              Tools designed specifically for healthcare professionals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Real Benefits for Your Practice
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              See how MedTaskFlow transforms your daily operations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Us
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Revolutionizing healthcare management with innovative digital solutions.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 items-center gap-8 py-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
            Trusted by Healthcare Professionals
          </h2>
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 text-center rounded-lg bg-gray-50 p-6 dark:bg-gray-900/50"
              >
                <img
                  alt={testimonial.author}
                  className="h-16 w-16 rounded-full object-cover"
                  src={testimonial.image}
                />
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <h3 className="font-semibold">{testimonial.author}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t">
        <div className="container px-4 mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-sm">© 2025 MedTaskFlow. All rights reserved.</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link to="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
              Privacy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}