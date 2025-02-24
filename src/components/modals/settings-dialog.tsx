import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/lib/contexts/language-context";
import { 
  Laptop, 
  Moon, 
  Settings, 
  Sun, 
  Bell,
  Eye,
  UserCircle2,
  Mail,
  Key,
  LogOut,
  Trash2,
  CreditCard,
  Check,
  Star,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
];

const plans = [
  {
    name: "Standard",
    price: "199,99€",
    iconType: "star",
    features: [
      "Up to 1,000 patients",
      "Basic analytics",
      "Email support",
      "5 team members"
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
      "Custom branding"
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
      "Dedicated account manager"
    ],
    level: 3
  }
];

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const currentPlan = "Premium"; // This would come from your user state/context
  const currentPlanLevel = plans.find(p => p.name === currentPlan)?.level || 0;

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

  const handlePlanAction = (plan: typeof plans[0]) => {
    setOpen(false);
    // Only pass serializable data
    navigate('/payment', { 
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('nav.settings')}</DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color theme.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="w-full"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="w-full"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="w-full"
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Select your preferred language.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{t(`languages.${lang.code}`)}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch checked={notificationEmail} onCheckedChange={setNotificationEmail} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch checked={notificationPush} onCheckedChange={setNotificationPush} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>Customize your accessibility preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      High Contrast
                    </Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Large Text
                    </Label>
                    <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
                  </div>
                  <Switch checked={largeText} onCheckedChange={setLargeText} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Screen Reader Support
                    </Label>
                    <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                  </div>
                  <Switch checked={screenReader} onCheckedChange={setScreenReader} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the Premium plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Premium Plan</p>
                      <p className="text-sm text-muted-foreground">299,99€ per month</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Current Plan</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => {
                const Icon = getIconComponent(plan.iconType);
                const isCurrentPlan = plan.name === currentPlan;
                const isDowngrade = plan.level < currentPlanLevel;
                const isUpgrade = plan.level > currentPlanLevel;
                
                return (
                  <Card key={plan.name} className={isCurrentPlan ? "border-primary" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-primary" />
                        {isCurrentPlan && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground"> /month</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan}
                        onClick={() => handlePlanAction(plan)}
                      >
                        {isCurrentPlan 
                          ? "Current Plan" 
                          : isDowngrade 
                            ? "Downgrade" 
                            : "Upgrade"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value="user@example.com" disabled />
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Change Email
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Button variant="outline" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-muted-foreground">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}