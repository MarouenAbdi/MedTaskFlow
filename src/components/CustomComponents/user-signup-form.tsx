import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/contexts/language-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/CustomComponents/icons';

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSignUpForm({ className, ...props }: UserSignUpFormProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { language } = useLanguage();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		// Store the language preference in localStorage
		localStorage.setItem('webpilot-language', language);

		setTimeout(() => {
			setIsLoading(false);
			navigate('/dashboard');
		}, 1000);
	}

	return (
		<div className={cn('grid gap-4', className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-3">
					<div className="grid gap-1.5">
						<Label htmlFor="name">{t('auth.fullName')}</Label>
						<Input
							id="name"
							placeholder={t('auth.fullNamePlaceholder')}
							type="text"
							autoCapitalize="words"
							autoComplete="name"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="email">{t('auth.email')}</Label>
						<Input
							id="email"
							placeholder="name@example.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="password">{t('auth.password')}</Label>
						<Input
							id="password"
							type="password"
							autoCapitalize="none"
							autoComplete="new-password"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<Button className="mt-2" disabled={isLoading}>
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						{t('auth.signUp')}
					</Button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						{t('auth.continueWith')}
					</span>
				</div>
			</div>
			<Button
				variant="outline"
				type="button"
				disabled={isLoading}
				className="h-9"
			>
				{isLoading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.google className="mr-2 h-4 w-4" />
				)}{' '}
				{t('auth.google')}
			</Button>
		</div>
	);
}
