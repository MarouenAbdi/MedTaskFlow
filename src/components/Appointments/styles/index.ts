export const styles = {
	container: 'flex flex-col space-y-6 min-h-[calc(100vh-8rem)] pb-8',
	header: {
		wrapper: 'flex items-start gap-4',
		avatar: 'h-12 w-12 mt-1',
		avatarFallback: 'bg-emerald-100 dark:bg-emerald-900/20',
		icon: 'h-6 w-6 text-emerald-600 dark:text-emerald-400',
		title: 'text-3xl font-bold tracking-tight',
		description: 'text-muted-foreground',
	},
	controls: {
		wrapper: (isMobile: boolean) =>
			`flex flex-wrap gap-4 ${
				isMobile ? 'flex-col' : 'items-center justify-between'
			}`,
		navigation: {
			wrapper: 'flex items-center gap-2',
			dateRange: 'text-lg font-semibold',
		},
		filters: {
			wrapper: 'flex items-center gap-4',
			select: 'w-[200px]',
		},
	},
	calendar: {
		container: 'border rounded-lg flex-1',
		mobile: {
			daySelector: {
				wrapper: 'border-b sticky top-0 bg-background z-10',
				scrollContainer: 'overflow-x-auto scrollbar-none',
				buttonContainer: 'flex gap-2 p-2 min-w-max',
				button: 'min-w-[120px]',
			},
			timeline: {
				wrapper: 'overflow-y-auto flex-1',
				slot: 'p-4 cursor-pointer hover:bg-accent/50 transition-colors',
				time: 'text-sm text-muted-foreground mb-2',
			},
		},
		desktop: {
			grid: {
				wrapper: 'grid grid-cols-[auto_1fr] h-full',
				timeColumn: 'border-r bg-muted/50',
				timeHeader: 'h-16 border-b bg-muted/50',
				timeSlot: 'h-20 px-2 py-1 text-sm text-muted-foreground bg-muted/50',
			},
			content: {
				wrapper: 'overflow-x-auto',
				grid: 'grid grid-cols-5 h-full min-w-[800px]',
				dayColumn: 'border-r last:border-r-0',
			},
			dayHeader: {
				wrapper: 'sticky top-0 z-10 bg-background',
				content: 'h-16 border-b p-2 text-center bg-muted/50',
				day: 'font-medium',
				date: 'text-sm text-muted-foreground mt-1',
			},
		},
	},
	appointment: {
		wrapper: (
			type: string
		) => `rounded-lg p-2 text-sm mb-1 cursor-pointer transition-colors hover:opacity-90 
            ${typeColors[type as keyof typeof typeColors]}`,
		header: {
			wrapper: 'flex items-center justify-between mb-2',
			patient: 'font-medium truncate',
			duration: 'text-sm text-muted-foreground',
			icon: 'h-3 w-3 inline-block mr-1',
		},
		badge: (type: string) =>
			`text-xs ${badgeColors[type as keyof typeof badgeColors]}`,
	},
} as const;

export const typeColors = {
	checkup:
		'bg-blue-100/90 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
	followup:
		'bg-green-100/90 text-green-900 dark:bg-green-900/30 dark:text-green-200',
	consultation:
		'bg-purple-100/90 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200',
	emergency: 'bg-red-100/90 text-red-900 dark:bg-red-900/30 dark:text-red-200',
};

export const badgeColors = {
	checkup:
		'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
	followup:
		'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800',
	consultation:
		'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800',
	emergency:
		'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800',
};
