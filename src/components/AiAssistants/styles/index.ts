export const styles = {
	container: 'space-y-6',
	header: {
		wrapper: 'flex justify-between items-start',
		titleSection: 'flex items-start gap-4',
		avatar: 'h-12 w-12 mt-1',
		avatarFallback: 'bg-indigo-100 dark:bg-indigo-900/20',
		icon: 'h-6 w-6 text-indigo-600 dark:text-indigo-400',
		title: 'text-3xl font-bold tracking-tight',
		description: 'text-muted-foreground',
	},
	search: {
		wrapper: 'flex items-center gap-4',
		container: 'flex w-full max-w-sm items-center space-x-2',
	},
	cards: {
		grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
		active: 'overflow-hidden border-2 border-primary/50',
		available: 'overflow-hidden',
		header: {
			wrapper: 'pb-2',
			content: 'flex justify-between items-start',
			imageContainer: 'flex gap-3',
			image: 'w-10 h-10 rounded-full overflow-hidden flex-shrink-0',
			img: 'w-full h-full object-cover',
		},
		content: {
			wrapper: 'pb-2',
			badges: 'flex flex-wrap gap-2 mb-2',
			badge: 'flex items-center gap-1',
		},
		footer: {
			wrapper: 'flex justify-between items-center border-t pt-4',
			price: 'text-sm text-muted-foreground',
		},
	},
	emptyState: {
		wrapper: 'text-center py-10',
		icon: 'h-12 w-12 mx-auto text-muted-foreground mb-4',
		title: 'text-lg font-medium',
		description: 'text-muted-foreground mb-4',
	},
} as const;
