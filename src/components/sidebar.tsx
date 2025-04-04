import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Calendar,
	ClipboardList,
	Receipt,
	Users,
	LayoutDashboard,
	Bot,
	ChevronLeft,
	ChevronRight,
	LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { NotificationsMenu } from './notifications-menu';
import { SettingsDialog } from './modals/settings-dialog';

interface SidebarProps {
	isCollapsed: boolean;
	onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
	const location = useLocation();
	const { t } = useTranslation();

	const navigation = [
		{
			name: t('nav.dashboard'),
			href: '/dashboard',
			icon: LayoutDashboard,
			activeColor: 'bg-rose-500/25',
			iconColor: 'text-rose-500',
		},
		{
			name: t('nav.appointments'),
			href: '/appointments',
			icon: Calendar,
			activeColor: 'bg-emerald-500/25',
			iconColor: 'text-emerald-500',
		},
		{
			name: t('nav.patients'),
			href: '/patients',
			icon: Users,
			activeColor: 'bg-purple-500/25',
			iconColor: 'text-purple-500',
		},
		{
			name: t('nav.medicalRecords'),
			href: '/medical-records',
			icon: ClipboardList,
			activeColor: 'bg-blue-500/25',
			iconColor: 'text-blue-500',
		},
		{
			name: t('nav.invoices'),
			href: '/invoices',
			icon: Receipt,
			activeColor: 'bg-amber-500/25',
			iconColor: 'text-amber-500',
		},
		{
			name: t('nav.aiAssistants'),
			href: '/ai-assistants',
			icon: Bot,
			activeColor: 'bg-indigo-500/25',
			iconColor: 'text-indigo-500',
		},
	];

	return (
		<div
			className={cn(
				'flex h-full flex-col relative text-primary-foreground',
				isCollapsed ? 'w-[52px]' : 'w-[220px]'
			)}
		>
			{/* Absolute positioned button wrapper that extends outside the sidebar */}
			{onToggleCollapse && (
				<div className="absolute -right-4 top-1/2 -translate-y-1/2 z-[1000] pointer-events-auto">
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							'h-8 w-8',
							'bg-zinc-900 border border-border shadow-md rounded-full',
							'hover:bg-zinc-800 text-zinc-400',
							'transition-all duration-300 ease-in-out'
						)}
						onClick={onToggleCollapse}
					>
						{isCollapsed ? (
							<ChevronRight className="h-5 w-5" />
						) : (
							<ChevronLeft className="h-5 w-5" />
						)}
					</Button>
				</div>
			)}

			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-4 p-3">
					<nav className="grid gap-3">
						{navigation.map((item) => {
							const isActive = location.pathname === item.href;
							return (
								<Button
									key={item.name}
									variant="ghost"
									className={cn(
										'w-full justify-start gap-4 transition-all duration-300 ease-in-out relative h-10 group',
										isCollapsed && 'justify-center w-10 px-0',
										isCollapsed ? 'hover:bg-transparent' : 'hover:bg-muted/50',
										'rounded-md',
										'text-zinc-400',
										isActive && 'text-white'
									)}
									title={isCollapsed ? item.name : undefined}
									asChild
								>
									<Link to={item.href}>
										<div
											className={cn(
												'relative z-10 p-[7px] rounded-full transition-colors duration-300',
												isActive && item.activeColor
											)}
										>
											<item.icon
												className={cn(
													'h-5 w-5 transition-transform duration-300 ease-in-out',
													isActive ? item.iconColor : 'text-zinc-400',
													'group-hover:text-white'
												)}
											/>
										</div>
										<span
											className={cn(
												'transition-all duration-300 ease-in-out text-sm',
												isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
												isActive ? 'font-bold text-white' : 'font-medium'
											)}
										>
											{item.name}
										</span>
									</Link>
								</Button>
							);
						})}
					</nav>
				</div>
			</ScrollArea>

			{/* Bottom Actions */}
			<div className="mt-auto flex flex-col gap-1 p-3">
				{/* Notifications */}
				<div
					className={cn(
						'flex w-full h-10 items-center text-zinc-400 rounded-md cursor-pointer transition-colors group',
						isCollapsed
							? 'justify-center px-0 hover:bg-transparent'
							: 'justify-start pl-[7px] gap-4 hover:bg-muted/50'
					)}
				>
					<div className="p-[0px] rounded-full [&_button]:bg-transparent [&_button]:hover:bg-transparent [&_button]:border-none [&_button]:shadow-none [&_button]:text-inherit [&_svg]:group-hover:text-white">
						<NotificationsMenu />
					</div>
					<span
						className={cn(
							'transition-all duration-300 ease-in-out font-medium text-sm',
							isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
						)}
					>
						{t('nav.notifications')}
					</span>
				</div>

				{/* Settings */}
				<div
					className={cn(
						'flex w-full h-10 items-center text-zinc-400 rounded-md cursor-pointer transition-colors group',
						isCollapsed
							? 'justify-center px-0 hover:bg-transparent'
							: 'justify-start pl-[7px] gap-4 hover:bg-muted/50'
					)}
				>
					<div className="p-[0px] rounded-full [&_button]:bg-transparent [&_button]:hover:bg-transparent [&_button]:border-none [&_button]:shadow-none [&_button]:text-inherit [&_svg]:group-hover:text-white">
						<SettingsDialog />
					</div>
					<span
						className={cn(
							'transition-all duration-300 ease-in-out font-medium text-sm',
							isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
						)}
					>
						{t('nav.settings')}
					</span>
				</div>

				{/* Logout Button */}
				<Button
					variant="ghost"
					className={cn(
						'w-full justify-start gap-4 transition-all duration-300 ease-in-out relative h-10 group',
						isCollapsed && 'justify-center w-10 px-0',
						isCollapsed ? 'hover:bg-transparent' : 'hover:bg-muted/50',
						'rounded-md',
						'text-zinc-400'
					)}
					title={isCollapsed ? t('nav.logout') : undefined}
					asChild
				>
					<Link to="/login">
						<div className="p-[7px] rounded-full">
							<LogOut className="h-5 w-5 group-hover:text-white" />
						</div>
						<span
							className={cn(
								'transition-all duration-300 ease-in-out font-medium text-sm',
								isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
							)}
						>
							{t('nav.logout')}
						</span>
					</Link>
				</Button>
			</div>

			<div
				className={cn(
					'border-t border-border p-4 transition-all duration-300 ease-in-out',
					isCollapsed ? 'opacity-0 h-0 p-0' : 'opacity-100 h-auto'
				)}
			>
				<p className="text-xs text-center text-zinc-400">
					&copy; {new Date().getFullYear()} {t('app.name')}
				</p>
			</div>
		</div>
	);
}
