import { cn } from '@/lib/utils';

interface WhiteLogoProps {
	className?: string;
}

export function WhiteLogo({ className }: WhiteLogoProps) {
	return (
		<div className={cn('relative', className)}>
			<img
				src="/assets/avatars/custom/MTF-logo.png"
				alt="MedTaskFlow Logo"
				className={cn(
					'w-full h-full object-contain brightness-0 invert',
					className
				)}
			/>
		</div>
	);
}
