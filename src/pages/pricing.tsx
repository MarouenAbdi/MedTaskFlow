import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Sparkles, CreditCard, Check } from "lucide-react";
import { Logo } from "@/components/logo";

const plans = [
  {
    name: "Standard",
    price: "199,99€",
    iconType: "star",
    features: [
      "Up to 1,000 patients",
      "Basic analytics",
      "Email support",
      "5 team members",
      "Appointment scheduling",
      "Patient records",
      "Basic reporting"
    ],
    level: 1
  },
  {
    name: "Premium",
    price: "299,99€",
    iconType: "sparkles",
    features: [
      "Up to 5,000 patients",
      "Advanced analytics",
      "Priority support",
      "15 team members",
      "Custom branding",
      "Advanced reporting",
      "Billing & invoicing",
      "API access",
      "Custom integrations"
    ],
    level: 2
  },
  {
    name: "Pro",
    price: "499,99€",
    iconType: "creditCard",
    features: [
      "Unlimited patients",
      "Enterprise analytics",
      "24/7 support",
      "Unlimited team members",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "Custom development",
      "SLA guarantee",
      "HIPAA compliance",
      "Advanced security"
    ],
    level: 3
  }
];

export function Pricing() {
  const navigate = useNavigate();

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'star':
        return Star;
      case 'sparkles':
        return Sparkles;
      case 'creditCard':
        return CreditCard;
      default:
        return Star;
    }
  };

  const handlePlanSelect = (plan: typeof plans[0]) => {
    navigate('/signup', { 
      state: { 
        plan: {
          name: plan.name,
          price: plan.price,
          features: plan.features,
          level: plan.level,
          iconType: plan.iconType
        }
      }
    });
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:sales@medtaskflow.com?subject=Enterprise Plan Inquiry';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="w-full border-b">
        <div className="container max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-2xl font-bold">MedTaskFlow</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your practice. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = getIconComponent(plan.iconType);
            
            return (
              <Card 
                key={plan.name} 
                className="relative flex flex-col p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xl transition-colors duration-300 group-hover:text-primary">
                      {plan.name}
                    </h3>
                    <div>
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button 
                    className="w-full transition-transform duration-300 group-hover:scale-105"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Get Started
                  </Button>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4 pt-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Need a custom plan?</h2>
          <p className="text-muted-foreground">
            Contact us for custom pricing and features tailored to your specific needs.
          </p>
          <Button size="lg" variant="outline" onClick={handleContactSales}>
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}