import { AiAssistant } from '../types';

export const styles = {
	container: 'space-y-6',
	header: {
		wrapper: 'flex items-start gap-4',
		avatar: 'h-12 w-12 mt-1',
		avatarFallback: 'bg-rose-100 dark:bg-rose-900/20',
		icon: 'h-6 w-6 text-rose-600 dark:text-rose-400',
		title: 'text-3xl font-bold tracking-tight',
		description: 'text-muted-foreground',
	},
	stats: {
		wrapper: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4',
		card: (color: string) =>
			`bg-gradient-to-br from-${color}-50/50 to-${color}-100/30 dark:from-${color}-950/5 dark:to-${color}-900/5 border-${color}-100 dark:border-${color}-900/20 hover:bg-accent/50 transition-colors cursor-pointer`,
		header: 'flex flex-row items-center justify-between pb-2 space-y-0',
		title: 'text-sm font-medium',
		iconWrapper: (color: string) =>
			`p-1.5 rounded-full bg-${color}-100 dark:bg-${color}-900/20`,
		icon: (color: string) => `h-4 w-4 text-${color}-500`,
		value: 'text-2xl font-bold',
		trend: 'text-xs text-muted-foreground',
	},
	content: {
		wrapper: 'grid gap-5',
		row: 'grid grid-cols-1 md:grid-cols-2 gap-5',
		threeColumns: 'grid grid-cols-1 md:grid-cols-3 gap-5',
	},
	appointments: {
		card: 'bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/10 dark:to-blue-900/5 border-blue-100 dark:border-blue-900/20',
		header: 'pb-3',
		headerContent: 'flex items-center justify-between',
		addIcon: 'mr-2 h-4 w-4',
		content: 'px-0',
		list: 'space-y-2 p-2',
		item: 'flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-muted',
		itemContent: 'flex items-center gap-3',
		avatar:
			'h-12 w-12 border-2 border-background shadow-sm rounded-full overflow-hidden',
		avatarFallback:
			'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 font-medium',
		patientName: 'font-medium leading-none mb-1',
		details: 'flex items-center gap-2',
		type: 'text-xs font-normal',
		time: 'flex items-center text-muted-foreground text-xs',
		timeIcon: 'w-3 h-3 mr-1',
		moreButton: 'h-8 w-8',
		moreIcon: 'h-4 w-4',
		footer: 'flex justify-between border-t px-3 py-3',
		footerText: 'text-xs text-muted-foreground',
		viewAllButton: 'text-xs gap-1',
		viewAllIcon: 'h-3 w-3',
	},
	quickActions: {
		card: 'bg-gradient-to-br from-indigo-50/80 to-indigo-100/50 dark:from-indigo-950/10 dark:to-indigo-900/5 border-indigo-100 dark:border-indigo-900/20',
		content: 'grid grid-cols-1 gap-3',
		item: (color: string) =>
			`p-3 rounded-lg ${color} hover:opacity-90 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md flex items-center gap-3`,
		icon: (color: string) =>
			`p-2 rounded-full bg-white/60 dark:bg-background/60 ${color}`,
		iconSize: 'h-4 w-4',
		title: 'font-medium text-sm',
		description: 'text-xs text-muted-foreground',
	},
	tasks: {
		card: 'bg-gradient-to-br from-sky-50/80 to-sky-100/50 dark:from-sky-950/10 dark:to-sky-900/5 border-sky-100 dark:border-sky-900/20',
		content: 'space-y-4',
		inputWrapper: 'flex gap-2',
		input: 'text-sm',
		addIcon: 'h-4 w-4',
		list: 'space-y-2 max-h-[180px] overflow-y-auto',
		item: (completed: boolean) =>
			`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 group ${
				completed ? 'opacity-60' : ''
			}`,
		checkButton: 'h-8 w-8',
		checkIcon: (completed: boolean) =>
			`h-4 w-4 ${completed ? 'text-green-500' : 'text-muted-foreground'}`,
		editInput: 'flex-1 text-sm',
		text: (completed: boolean) =>
			`flex-1 text-sm ${completed ? 'line-through' : ''}`,
		actions: 'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
		actionButton: 'h-8 w-8',
		actionIcon: 'h-4 w-4',
		deleteButton: 'h-8 w-8 text-destructive',
		deleteIcon: 'h-4 w-4',
	},
	activity: {
		card: 'bg-gradient-to-br from-slate-50/80 to-blue-100/50 dark:from-slate-950/10 dark:to-blue-900/5 border-slate-100 dark:border-slate-900/20',
		list: 'space-y-4 max-h-[280px] overflow-y-auto',
		item: 'flex items-start gap-4',
		icon: (color: string) => `p-2 rounded-full ${color} mt-0.5`,
		iconSize: (color: string) => `h-4 w-4 ${color}`,
		content: 'space-y-1',
		title: 'text-sm font-medium',
		description: 'text-xs text-muted-foreground',
		time: 'text-xs text-muted-foreground',
	},
	aiAssistants: {
		card: (assistant: AiAssistant) =>
			`bg-gradient-to-br ${assistant.color} ${assistant.borderColor} relative overflow-hidden`,
		title: 'flex items-center gap-2',
		icon: (assistant: AiAssistant) => `p-1.5 rounded-full ${assistant.iconBg}`,
		iconSize: (assistant: AiAssistant) => `h-4 w-4 ${assistant.iconColor}`,
		content: 'space-y-4',
		features: 'space-y-3',
		feature: 'flex items-start gap-3',
		featureIcon: 'p-1 rounded-full bg-green-100 dark:bg-green-900/20 mt-0.5',
		checkIcon: 'h-3 w-3 text-green-600 dark:text-green-400',
		featureText: 'text-sm',
		pricing:
			'bg-white dark:bg-background/60 p-3 rounded-lg border border-opacity-20',
		pricingTitle: 'text-sm font-medium mb-1',
		pricingSubtitle: 'text-xs text-muted-foreground mb-3',
		button: (assistant: AiAssistant) =>
			`w-full ${assistant.buttonBg} text-white`,
		navigation: 'flex flex-col items-center gap-2 pt-2',
		progress:
			'w-full bg-slate-200/30 dark:bg-slate-700/30 h-0.5 rounded-full overflow-hidden',
		progressBar:
			'bg-white/80 dark:bg-white/80 h-full transition-all duration-300 ease-linear',
		dots: 'flex justify-center gap-2 w-full',
		dot: (isActive: boolean) =>
			`h-3 w-3 p-0 rounded-full border-2 ${
				isActive
					? 'bg-slate-800 border-slate-800 dark:bg-slate-200 dark:border-slate-200'
					: 'bg-transparent border-slate-500/70 hover:border-slate-700 dark:hover:border-slate-300'
			}`,
	},
};
