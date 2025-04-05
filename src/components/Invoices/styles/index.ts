export const styles = {
	container: 'space-y-6',
	header: {
		wrapper: 'flex items-start gap-4',
		avatar: 'h-12 w-12 mt-1',
		avatarFallback: 'bg-amber-100 dark:bg-amber-900/20',
		icon: 'h-6 w-6 text-amber-600 dark:text-amber-400',
		title: 'text-3xl font-bold tracking-tight',
		description: 'text-muted-foreground',
	},
	actions: {
		wrapper: 'flex items-center gap-4',
		search: {
			wrapper: 'relative w-[300px]',
			icon: 'absolute left-2 top-2.5 h-4 w-4 text-muted-foreground',
			input: 'pl-8',
		},
		filters: {
			wrapper: 'flex items-center gap-4 ml-auto',
			status: 'w-[180px]',
			dateRange: {
				button: (hasRange: boolean) =>
					`w-[240px] justify-start text-left font-normal ${
						!hasRange && 'text-muted-foreground'
					}`,
				icon: 'mr-2 h-4 w-4',
				content: 'w-auto p-0',
				header: 'border-b border-border p-3 flex items-center justify-between',
				title: 'text-sm font-medium',
				clearButton: 'h-8 px-2',
			},
		},
		bulkActions: {
			button: 'gap-2',
			icon: 'h-4 w-4',
		},
	},
	table: {
		wrapper: 'rounded-md border',
		row: 'cursor-pointer group hover:bg-accent/50 transition-colors',
		checkboxCell: 'w-[50px]',
		invoiceNumber: 'font-medium group-hover:text-primary transition-colors',
		patient: {
			wrapper: 'flex items-center gap-3',
			avatar: {
				fallback: 'bg-primary/10 text-primary/80',
				initials: (name: string) =>
					name
						.split(' ')
						.map((n) => n[0])
						.join(''),
			},
		},
		amount: 'text-right',
	},
};
