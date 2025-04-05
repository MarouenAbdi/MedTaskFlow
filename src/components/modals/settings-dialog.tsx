import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/lib/contexts/language-context';
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
	Sparkles,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const languages = [
	{ code: 'en', flag: '🇬🇧', name: 'English' },
	{ code: 'fr', flag: '🇫🇷', name: 'Français' },
	{ code: 'es', flag: '🇪🇸', name: 'Español' },
	{ code: 'pt', flag: '🇵🇹', name: 'Português' },
	{ code: 'de', flag: '🇩🇪', name: 'Deutsch' },
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

	const handleChangePlan = () => {
		setOpen(false);
		navigate('/manage-subscription');
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
				<DialogHeader className="px-6 py-4 border-b">
					<DialogTitle>{t('nav.settings')}</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="appearance" className="flex-1 flex overflow-hidden">
					<TabsList className="flex flex-col gap-2 p-4 border-r h-full w-[200px] justify-start">
						<TabsTrigger
							value="appearance"
							className="justify-start gap-2 w-full"
						>
							<Sun className="h-4 w-4" />
							Appearance
						</TabsTrigger>
						<TabsTrigger
							value="notifications"
							className="justify-start gap-2 w-full"
						>
							<Bell className="h-4 w-4" />
							Notifications
						</TabsTrigger>
						<TabsTrigger
							value="accessibility"
							className="justify-start gap-2 w-full"
						>
							<Eye className="h-4 w-4" />
							Accessibility
						</TabsTrigger>
						<TabsTrigger
							value="subscription"
							className="justify-start gap-2 w-full"
						>
							<CreditCard className="h-4 w-4" />
							Subscription
						</TabsTrigger>
						<TabsTrigger value="account" className="justify-start gap-2 w-full">
							<UserCircle2 className="h-4 w-4" />
							Account
						</TabsTrigger>
					</TabsList>

					<div className="flex-1 overflow-y-auto p-6">
						<TabsContent value="appearance" className="mt-0">
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Theme</CardTitle>
										<CardDescription>
											Choose your preferred color theme.
										</CardDescription>
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
										<CardDescription>
											Select your preferred language.
										</CardDescription>
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
							</div>
						</TabsContent>

						<TabsContent value="notifications" className="mt-0">
							<Card>
								<CardHeader>
									<CardTitle>Notification Preferences</CardTitle>
									<CardDescription>
										Choose how you want to receive notifications.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label className="flex items-center gap-2">
												<Mail className="h-4 w-4" />
												Email Notifications
											</Label>
											<p className="text-sm text-muted-foreground">
												Receive notifications via email
											</p>
										</div>
										<Switch
											checked={notificationEmail}
											onCheckedChange={setNotificationEmail}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label className="flex items-center gap-2">
												<Bell className="h-4 w-4" />
												Push Notifications
											</Label>
											<p className="text-sm text-muted-foreground">
												Receive push notifications
											</p>
										</div>
										<Switch
											checked={notificationPush}
											onCheckedChange={setNotificationPush}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="accessibility" className="mt-0">
							<Card>
								<CardHeader>
									<CardTitle>Accessibility Settings</CardTitle>
									<CardDescription>
										Customize your accessibility preferences.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label className="flex items-center gap-2">
												<Eye className="h-4 w-4" />
												High Contrast
											</Label>
											<p className="text-sm text-muted-foreground">
												Increase contrast for better visibility
											</p>
										</div>
										<Switch
											checked={highContrast}
											onCheckedChange={setHighContrast}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label className="flex items-center gap-2">
												<Sun className="h-4 w-4" />
												Large Text
											</Label>
											<p className="text-sm text-muted-foreground">
												Increase text size throughout the app
											</p>
										</div>
										<Switch
											checked={largeText}
											onCheckedChange={setLargeText}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label className="flex items-center gap-2">
												<Bell className="h-4 w-4" />
												Screen Reader Support
											</Label>
											<p className="text-sm text-muted-foreground">
												Optimize for screen readers
											</p>
										</div>
										<Switch
											checked={screenReader}
											onCheckedChange={setScreenReader}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="subscription" className="mt-0">
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Current Plan</CardTitle>
										<CardDescription>
											You are currently on the Premium plan
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Sparkles className="h-5 w-5 text-primary" />
												<div>
													<p className="font-medium">Premium Plan</p>
													<p className="text-sm text-muted-foreground">
														299,99€ per month
													</p>
												</div>
											</div>
											<Badge variant="secondary">Current Plan</Badge>
										</div>
									</CardContent>
									<CardFooter>
										<Button className="w-full" onClick={handleChangePlan}>
											Change Plan
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Billing History</CardTitle>
										<CardDescription>
											View your recent billing history
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex justify-between items-center py-2 border-b">
												<div>
													<p className="font-medium">March 2024</p>
													<p className="text-sm text-muted-foreground">
														Premium Plan
													</p>
												</div>
												<p className="font-medium">299,99€</p>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<div>
													<p className="font-medium">February 2024</p>
													<p className="text-sm text-muted-foreground">
														Premium Plan
													</p>
												</div>
												<p className="font-medium">299,99€</p>
											</div>
											<div className="flex justify-between items-center py-2">
												<div>
													<p className="font-medium">January 2024</p>
													<p className="text-sm text-muted-foreground">
														Premium Plan
													</p>
												</div>
												<p className="font-medium">299,99€</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="account" className="mt-0">
							<Card>
								<CardHeader>
									<CardTitle>Account Settings</CardTitle>
									<CardDescription>
										Manage your account information and preferences.
									</CardDescription>
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
										<Button
											variant="outline"
											className="w-full text-muted-foreground"
										>
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
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
