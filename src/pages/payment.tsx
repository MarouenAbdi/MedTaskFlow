import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
	CreditCard,
	Check,
	Star,
	Sparkles,
	LogOut,
	Bitcoin,
	ArrowLeft,
} from 'lucide-react';
import { Logo } from '@/components/CustomComponents/logo';

const planColors = {
	Standard:
		'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
	Premium:
		'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
	Pro: 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
};

// Official payment provider logos
const PAYMENT_LOGOS = {
	googlepay:
		'https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png',
	applepay:
		'https://developer.apple.com/assets/elements/badges/apple-pay-mark.svg',
	paypal:
		'https://www.paypalobjects.com/digitalassets/c/website/marketing/na/us/logo-center/Badge_2.png',
	visa: 'https://usa.visa.com/dam/VCOM/regional/ve/romania/blogs/hero-image/visa-logo-800x450.jpg',
};

export function Payment() {
	const location = useLocation();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isProcessing, setIsProcessing] = useState(false);
	const selectedPlan = location.state?.plan;

	if (!selectedPlan) {
		navigate('/dashboard');
		return null;
	}

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

	const PlanIcon = getIconComponent(selectedPlan.iconType);

	const handlePayment = () => {
		setIsProcessing(true);
		setTimeout(() => {
			setIsProcessing(false);
			toast.success('Payment successful!');
			navigate('/dashboard');
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Navbar */}
			<header className="flex h-16 items-center border-b px-6">
				<div className="flex items-center gap-2 flex-1">
					<Link to="/" className="flex items-center gap-2">
						<Logo className="h-6 w-6" />
						<span className="text-xl font-semibold">{t('app.name')}</span>
					</Link>
				</div>
				<Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
					<LogOut className="h-5 w-5" />
				</Button>
			</header>

			<div className="container max-w-[800px] px-6 py-8">
				<Button
					variant="ghost"
					className="mb-6 -ml-2 h-8 px-2"
					onClick={() => navigate(-1)}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">Payment Details</h1>
						<p className="text-muted-foreground">
							Complete your subscription payment
						</p>
					</div>

					<Card className={cn('border-2 px-4', planColors[selectedPlan.name])}>
						<CardHeader>
							<CardTitle>Selected Plan</CardTitle>
							<CardDescription>
								You are subscribing to the {selectedPlan.name} plan
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div
										className={cn(
											'p-2 rounded-lg',
											planColors[selectedPlan.name]
										)}
									>
										<PlanIcon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<p className="font-medium">{selectedPlan.name} Plan</p>
										<p className="text-2xl font-bold">{selectedPlan.price}</p>
										<p className="text-sm text-muted-foreground">per month</p>
									</div>
								</div>
								<ul className="text-sm space-y-1">
									{selectedPlan.features.slice(0, 3).map((feature, i) => (
										<li key={i} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Payment Method</CardTitle>
							<CardDescription>
								Choose your preferred payment method
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="card" className="w-full">
								<TabsList className="grid w-full grid-cols-5 gap-4">
									<TabsTrigger value="card" className="flex items-center gap-2">
										<img
											src={PAYMENT_LOGOS.visa}
											alt="Visa"
											className="h-4 object-contain"
										/>
										Card
									</TabsTrigger>
									<TabsTrigger value="googlepay">
										<img
											src={PAYMENT_LOGOS.googlepay}
											alt="Google Pay"
											className="h-6 object-contain dark:brightness-0 dark:invert"
										/>
										<span className="text-[#3c4043] dark:text-current ml-1">
											Pay
										</span>
									</TabsTrigger>
									<TabsTrigger value="applepay">
										<img
											src={PAYMENT_LOGOS.applepay}
											alt="Apple Pay"
											className="h-6 object-contain dark:brightness-0 dark:invert"
										/>
									</TabsTrigger>
									<TabsTrigger value="paypal">
										<img
											src={PAYMENT_LOGOS.paypal}
											alt="PayPal"
											className="h-6 object-contain"
										/>
									</TabsTrigger>
									<TabsTrigger value="crypto">
										<Bitcoin className="h-4 w-4 text-orange-500" />
									</TabsTrigger>
								</TabsList>

								<TabsContent value="card" className="space-y-4 mt-4">
									<div className="space-y-2">
										<Label>Card Number</Label>
										<div className="relative">
											<Input placeholder="1234 5678 9012 3456" />
											<img
												src={PAYMENT_LOGOS.visa}
												alt="Visa"
												className="absolute right-3 top-2.5 h-5 w-auto object-contain"
											/>
										</div>
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label>Expiry Date</Label>
											<Input placeholder="MM/YY" />
										</div>
										<div className="space-y-2">
											<Label>CVC</Label>
											<Input placeholder="123" />
										</div>
										<div className="space-y-2">
											<Label>ZIP/Postal</Label>
											<Input placeholder="12345" />
										</div>
									</div>
								</TabsContent>

								<TabsContent value="googlepay" className="mt-4">
									<div className="text-center py-8">
										<img
											src={PAYMENT_LOGOS.googlepay}
											alt="Google Pay"
											className="h-16 mx-auto mb-4 dark:brightness-0 dark:invert"
										/>
										<p className="text-lg font-medium">Pay with Google Pay</p>
										<p className="text-sm text-muted-foreground">
											Click the button below to pay with Google Pay
										</p>
									</div>
								</TabsContent>

								<TabsContent value="applepay" className="mt-4">
									<div className="text-center py-8">
										<img
											src={PAYMENT_LOGOS.applepay}
											alt="Apple Pay"
											className="h-16 mx-auto mb-4 dark:brightness-0 dark:invert"
										/>
										<p className="text-lg font-medium">Pay with Apple Pay</p>
										<p className="text-sm text-muted-foreground">
											Click the button below to pay with Apple Pay
										</p>
									</div>
								</TabsContent>

								<TabsContent value="paypal" className="mt-4">
									<div className="text-center py-8">
										<img
											src={PAYMENT_LOGOS.paypal}
											alt="PayPal"
											className="h-16 mx-auto mb-4"
										/>
										<p className="text-lg font-medium">Pay with PayPal</p>
										<p className="text-sm text-muted-foreground">
											You will be redirected to PayPal to complete your payment
										</p>
									</div>
								</TabsContent>

								<TabsContent value="crypto" className="mt-4">
									<div className="text-center py-8">
										<div className="inline-block p-4 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
											<Bitcoin className="h-12 w-12 text-orange-500" />
										</div>
										<p className="text-lg font-medium">
											Pay with Cryptocurrency
										</p>
										<p className="text-sm text-muted-foreground">
											Choose your preferred cryptocurrency to complete the
											payment
										</p>
										<div className="mt-6 flex justify-center gap-4">
											<Button variant="outline" className="min-w-[120px]">
												Bitcoin
											</Button>
											<Button variant="outline" className="min-w-[120px]">
												Ethereum
											</Button>
											<Button variant="outline" className="min-w-[120px]">
												USDC
											</Button>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								onClick={handlePayment}
								disabled={isProcessing}
								size="lg"
							>
								{isProcessing ? (
									<>
										<svg
											className="mr-2 h-4 w-4 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Processing...
									</>
								) : (
									`Pay ${selectedPlan.price}`
								)}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
