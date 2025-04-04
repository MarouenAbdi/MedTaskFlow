import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Calendar,
	ClipboardList,
	FileText,
	Users,
	LayoutDashboard,
	Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Logo } from './logo';

export function Sidebar() {
	const location = useLocation();
	const { t } = useTranslation();

	const navigation = [
		{ name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
		{ name: t('nav.appointments'), href: '/appointments', icon: Calendar },
		{ name: t('nav.patients'), href: '/patients', icon: Users },
		{
			name: t('nav.medicalRecords'),
			href: '/medical-records',
			icon: ClipboardList,
		},
		{ name: t('nav.invoices'), href: '/invoices', icon: FileText },
		{ name: t('nav.aiAssistants'), href: '/ai-assistants', icon: Bot },
	];

	return (
		<div className="flex h-full w-64 flex-col">
			<div className="flex h-[60px] items-center border-b px-6">
				<Link to="/dashboard" className="flex items-center gap-2">
					<Logo className="h-6 w-6" />
					<span className="text-xl font-semibold">{t('app.name')}</span>
				</Link>
			</div>
			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-2 p-2">
					<nav className="grid gap-1 px-2">
						{navigation.map((item) => {
							const isActive = location.pathname === item.href;
							return (
								<Button
									key={item.name}
									variant={isActive ? 'secondary' : 'ghost'}
									className={cn(
										'w-full justify-start gap-2',
										isActive && 'bg-secondary'
									)}
									asChild
								>
									<Link to={item.href}>
										<item.icon className="h-4 w-4" />
										{item.name}
									</Link>
								</Button>
							);
						})}
					</nav>
				</div>
			</ScrollArea>
			<div className="border-t p-4">
				<p className="text-xs text-center text-muted-foreground">
					&copy; {new Date().getFullYear()} {t('app.name')}
				</p>
			</div>
		</div>
	);
}
