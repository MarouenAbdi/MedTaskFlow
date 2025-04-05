import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import {
	Star,
	Sparkles,
	CreditCard,
	Check,
	ArrowLeft,
	AlertTriangle,
	LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Logo } from '@/components/CustomComponents/logo';
import { NotificationsMenu } from '@/components/CustomComponents/notifications-menu';
import { SettingsDialog } from '@/modals/settings-dialog';

const plans = [
	{
		name: 'Standard',
		price: '199,99€',
		iconType: 'star',
		features: [
			'Up to 1,000 patients',
			'Basic analytics',
			'Email support',
			'5 team members',
			'Appointment scheduling',
			'Patient records',
			'Basic reporting',
		],
		level: 1,
	},
	{
		name: 'Premium',
		price: '299,99€',
		iconType: 'sparkles',
		features: [
			'Up to 5,000 patients',
			'Advanced analytics',
			'Priority support',
			'15 team members',
			'Custom branding',
			'Advanced reporting',
			'Billing & invoicing',
			'API access',
			'Custom integrations',
		],
		level: 2,
	},
	{
		name: 'Pro',
		price: '499,99€',
		iconType: 'creditCard',
		features: [
			'Unlimited patients',
			'Enterprise analytics',
			'24/7 support',
			'Unlimited team members',
			'Custom branding',
			'API access',
			'Dedicated account manager',
			'Custom development',
			'SLA guarantee',
			'HIPAA compliance',
			'Advanced security',
		],
		level: 3,
	},
];

export function ManageSubscription() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [showCancelAlert, setShowCancelAlert] = useState(false);
	const currentPlan = 'Premium'; // This would come from your user state/context
	const currentPlanLevel =
		plans.find((p) => p.name === currentPlan)?.level || 0;

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

	const handlePlanSelect = (plan: (typeof plans)[0]) => {
		if (plan.name === currentPlan) return;
		navigate('/payment', {
			state: {
				plan: {
					name: plan.name,
					price: plan.price,
					features: plan.features,
					level: plan.level,
					iconType: plan.iconType,
				},
			},
		});
	};

	const handleCancelMembership = () => {
		toast.success('Your membership has been cancelled');
		navigate('/dashboard');
	};

	return (
		<div className="min-h-screen bg-background">
			<header className="flex h-16 items-center border-b px-6">
				<div className="flex items-center gap-2 flex-1">
					<Link to="/" className="flex items-center gap-2">
						<Logo className="h-6 w-6" />
						<span className="text-xl font-semibold">{t('app.name')}</span>
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<NotificationsMenu />
					<SettingsDialog />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate('/login')}
					>
						<LogOut className="h-5 w-5" />
					</Button>
				</div>
			</header>

			<div className="container max-w-7xl mx-auto py-8 px-4">
				<Button
					variant="ghost"
					className="mb-8 -ml-4"
					onClick={() => navigate('/')}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Home
				</Button>

				<div className="space-y-8">
					<div>
						<h1 className="text-3xl font-bold tracking-tight mb-2">
							Manage Subscription
						</h1>
						<p className="text-muted-foreground">
							Review and manage your subscription plan
						</p>
					</div>

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
							<Button
								variant="destructive"
								className="w-full"
								onClick={() => setShowCancelAlert(true)}
							>
								Cancel Membership
							</Button>
						</CardFooter>
					</Card>

					<Separator />

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Available Plans</h2>
						<div className="grid gap-6 md:grid-cols-3">
							{plans.map((plan) => {
								const Icon = getIconComponent(plan.iconType);
								const isCurrentPlan = plan.name === currentPlan;
								const isDowngrade = plan.level < currentPlanLevel;
								const isUpgrade = plan.level > currentPlanLevel;

								return (
									<Card
										key={plan.name}
										className={isCurrentPlan ? 'border-primary' : ''}
									>
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
												variant={isCurrentPlan ? 'outline' : 'default'}
												disabled={isCurrentPlan}
												onClick={() => handlePlanSelect(plan)}
											>
												{isCurrentPlan
													? 'Current Plan'
													: isDowngrade
													? 'Downgrade'
													: 'Upgrade'}
											</Button>
										</CardFooter>
									</Card>
								);
							})}
						</div>
					</div>

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

				<AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Cancel Membership</AlertDialogTitle>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
									<AlertTriangle className="h-4 w-4" />
									<span className="font-medium">Warning</span>
								</div>
								<div>
									Are you sure you want to cancel your membership? This will:
								</div>
								<div className="pl-4">
									<ul className="list-disc space-y-1">
										<li>Cancel your subscription immediately</li>
										<li>Remove access to premium features</li>
										<li>Delete all saved preferences</li>
									</ul>
								</div>
								<div>This action cannot be undone.</div>
							</div>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Keep Subscription</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={handleCancelMembership}
							>
								Cancel Membership
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
