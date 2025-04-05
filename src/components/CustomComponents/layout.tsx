import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Sheet, SheetContent } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function Layout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(true);

	return (
		<div className="min-h-screen flex flex-col">
			{/* Main content area with sidebar */}
			<div className="flex h-screen overflow-hidden">
				{/* Mobile menu button - floating position */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden fixed top-4 left-4 z-50 bg-zinc-800/80 text-white hover:bg-zinc-700/80 dark:bg-muted/80 dark:text-primary-foreground dark:hover:bg-accent/80"
					onClick={() => setIsSidebarOpen(true)}
				>
					<Menu className="h-5 w-5" />
				</Button>

				{/* Desktop Sidebar - Always Dark Theme */}
				<div
					className={cn(
						'hidden fixed top-0 bottom-0 bg-zinc-900/90 shadow-lg md:block transition-all duration-300 ease-in-out z-10 dark',
						isCollapsed ? 'w-[52px]' : 'w-[220px]'
					)}
				>
					<Sidebar
						isCollapsed={isCollapsed}
						onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
					/>
				</div>

				{/* Mobile Sidebar - Always Dark Theme */}
				<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
					<SheetContent
						side="left"
						className="p-0 w-[220px] bg-zinc-900/90 dark"
					>
						<Sidebar isCollapsed={false} />
					</SheetContent>
				</Sheet>

				{/* Main content */}
				<div
					className={cn(
						'flex-1 relative',
						isCollapsed ? 'md:ml-[52px]' : 'md:ml-[220px]'
					)}
				>
					<ScrollArea className="h-screen">
						<div className="p-4 md:p-8">
							<Outlet />
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
