import { cn } from '@/lib/utils';

interface LogoProps {
	className?: string;
}

export function Logo({ className }: LogoProps) {
	return (
		<div className={cn('relative', className)}>
			<img
				src="/assets/avatars/custom/MTF-logo.png"
				alt="MedTaskFlow Logo"
				className={cn(
					'w-full h-full object-contain transition-all duration-200',
					className
				)}
			/>
		</div>
	);
}
