import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Calendar,
	DollarSign,
	FileText,
	UserPlus,
	AlertCircle,
	Plus,
	CheckCircle2,
	Edit2,
	Trash2,
	ChevronRight,
	MoreHorizontal,
	Users,
	Bot,
	LayoutDashboard,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NewAppointmentDialog } from '@/components/modals/new-appointment-dialog';
import { NewPatientDialog } from '@/components/modals/new-patient-dialog';
import { NewMedicalRecordDialog } from '@/components/modals/new-medical-record-dialog';
import { NewInvoiceDialog } from '@/components/modals/new-invoice-dialog';
import { toast } from 'sonner';

// Mock data
const upcomingAppointments = [
	{
		patient: 'Emma Thompson',
		time: '09:00',
		type: 'Checkup',
		avatar:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80&crop=faces,center',
	},
	{
		patient: 'James Wilson',
		time: '10:30',
		type: 'Follow-up',
		avatar:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80&crop=faces,center',
	},
	{
		patient: 'Sophia Chen',
		time: '11:45',
		type: 'Consultation',
		avatar:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80&crop=faces,center',
	},
	{
		patient: 'Michael Rodriguez',
		time: '14:15',
		type: 'Physical Therapy',
		avatar: '', // Empty to show initials fallback
	},
];

const recentActivity = [
	{
		title: 'Medical record updated',
		description: "Dr. Smith updated Emma Thompson's records",
		icon: FileText,
		color: 'bg-indigo-100 dark:bg-indigo-900/20',
		iconColor: 'text-indigo-600 dark:text-indigo-400',
		time: '2h ago',
	},
	{
		title: 'New patient registered',
		description: 'James Wilson completed registration',
		icon: UserPlus,
		color: 'bg-blue-100 dark:bg-blue-900/20',
		iconColor: 'text-blue-600 dark:text-blue-400',
		time: '4h ago',
	},
	{
		title: 'Appointment rescheduled',
		description: 'Sarah Johnson rescheduled to next week',
		icon: Calendar,
		color: 'bg-sky-100 dark:bg-sky-900/20',
		iconColor: 'text-sky-600 dark:text-sky-400',
		time: 'yesterday',
	},
];

// AI Assistants for carousel
const aiAssistants = [
	{
		name: 'MedScribe',
		description: 'Automated medical transcription assistant',
		features: [
			'Convert voice to structured notes',
			'Extract key medical terms',
			'Integrate with EHR systems',
		],
		price: '$29',
		color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40',
		borderColor: 'border-blue-100 dark:border-blue-900',
		icon: Bot,
		iconBg: 'bg-blue-100 dark:bg-blue-900/50',
		iconColor: 'text-blue-600 dark:text-blue-400',
		buttonBg: 'bg-blue-600 hover:bg-blue-700',
	},
	{
		name: 'DiagnosticAI',
		description: 'Differential diagnosis support tool',
		features: [
			'Symptom analysis suggestions',
			'Evidence-based recommendations',
			'Clinical research updates',
		],
		price: '$39',
		color:
			'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/40',
		borderColor: 'border-indigo-100 dark:border-indigo-900',
		icon: FileText,
		iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
		iconColor: 'text-indigo-600 dark:text-indigo-400',
		buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
	},
	{
		name: 'PatientScheduler',
		description: 'Intelligent appointment management',
		features: [
			'Smart scheduling algorithms',
			'Automated reminders',
			'Patient flow optimization',
		],
		price: '$24',
		color: 'from-sky-50 to-sky-100 dark:from-sky-950/30 dark:to-sky-900/40',
		borderColor: 'border-sky-100 dark:border-sky-900',
		icon: Calendar,
		iconBg: 'bg-sky-100 dark:bg-sky-900/50',
		iconColor: 'text-sky-600 dark:text-sky-400',
		buttonBg: 'bg-sky-600 hover:bg-sky-700',
	},
];

interface Todo {
	id: string;
	text: string;
	completed: boolean;
	isEditing?: boolean;
}

export function Dashboard() {
	const [todos, setTodos] = useState<Todo[]>([
		{ id: '1', text: 'Review patient files', completed: false },
		{ id: '2', text: 'Order medical supplies', completed: false },
		{ id: '3', text: 'Update vaccination records', completed: true },
	]);
	const [newTodo, setNewTodo] = useState('');
	const [currentAssistant, setCurrentAssistant] = useState(0);
	const [rotationProgress, setRotationProgress] = useState(0);

	const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
	const [patientDialogOpen, setPatientDialogOpen] = useState(false);
	const [recordDialogOpen, setRecordDialogOpen] = useState(false);
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

	// Auto-rotate AI assistants every 5 seconds with progress indication
	useEffect(() => {
		// Update progress every 50ms (5 seconds / 100 progress steps)
		const progressInterval = setInterval(() => {
			setRotationProgress((prev) => {
				if (prev >= 100) {
					// Reset progress and move to next assistant
					setCurrentAssistant((current) =>
						current === aiAssistants.length - 1 ? 0 : current + 1
					);
					return 0;
				}
				return prev + 1;
			});
		}, 50); // 50ms * 100 steps = 5 seconds

		// Clean up interval on component unmount
		return () => clearInterval(progressInterval);
	}, []);

	// Reset progress when manually changing slides
	const goToAssistant = (index: number) => {
		setCurrentAssistant(index);
		setRotationProgress(0);
	};

	const addTodo = () => {
		if (newTodo.trim()) {
			setTodos([
				{ id: Date.now().toString(), text: newTodo.trim(), completed: false },
				...todos,
			]);
			setNewTodo('');
		}
	};

	const toggleTodo = (id: string) => {
		setTodos(
			todos
				.map((todo) =>
					todo.id === id ? { ...todo, completed: !todo.completed } : todo
				)
				.sort((a, b) => {
					if (a.completed === b.completed) return 0;
					return a.completed ? 1 : -1;
				})
		);
	};

	const startEditing = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, isEditing: true } : todo
			)
		);
	};

	const updateTodo = (id: string, newText: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
			)
		);
	};

	const deleteTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const quickActions = [
		{
			icon: Calendar,
			title: 'Schedule Appointment',
			description: 'Book a new patient visit',
			color: 'bg-emerald-100 dark:bg-emerald-900/20',
			iconColor: 'text-emerald-600 dark:text-emerald-400',
			onClick: () => setAppointmentDialogOpen(true),
		},
		{
			icon: UserPlus,
			title: 'Add Patient',
			description: 'Register a new patient',
			color: 'bg-purple-100 dark:bg-purple-900/20',
			iconColor: 'text-purple-600 dark:text-purple-400',
			onClick: () => setPatientDialogOpen(true),
		},
		{
			icon: FileText,
			title: 'Create Record',
			description: 'Add medical record',
			color: 'bg-amber-100 dark:bg-amber-900/20',
			iconColor: 'text-amber-600 dark:text-amber-400',
			onClick: () => setRecordDialogOpen(true),
		},
		{
			icon: DollarSign,
			title: 'Create Invoice',
			description: 'Generate new invoice',
			color: 'bg-rose-100 dark:bg-rose-900/20',
			iconColor: 'text-rose-600 dark:text-rose-400',
			onClick: () => setInvoiceDialogOpen(true),
		},
	];

	const handleNewAppointment = () => {
		toast.success('New appointment scheduled successfully');
	};

	const handleNewPatient = () => {
		toast.success('New patient registered successfully');
	};

	const handleNewRecord = () => {
		toast.success('New medical record created successfully');
	};

	const handleNewInvoice = () => {
		toast.success('New invoice created successfully');
	};

	return (
		<div className="flex flex-col gap-5 w-full">
			{/* Welcome header */}
			<div className="flex items-start gap-4">
				<Avatar className="h-12 w-12 mt-1">
					<AvatarFallback className="bg-rose-100 dark:bg-rose-900/20">
						<LayoutDashboard className="h-6 w-6 text-rose-600 dark:text-rose-400" />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
					<p className="text-muted-foreground">
						Welcome to your medical practice management dashboard
					</p>
				</div>
			</div>

			{/* Stats cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/5 dark:to-blue-900/5 border-blue-100 dark:border-blue-900/20 hover:bg-accent/50 transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Total Appointments
						</CardTitle>
						<div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/20">
							<Calendar className="h-4 w-4 text-blue-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">24</div>
						<p className="text-xs text-muted-foreground">
							+15% from last month
						</p>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-sky-50/50 to-sky-100/30 dark:from-sky-950/5 dark:to-sky-900/5 border-sky-100 dark:border-sky-900/20 hover:bg-accent/50 transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Active Patients
						</CardTitle>
						<div className="p-1.5 rounded-full bg-sky-100 dark:bg-sky-900/20">
							<Users className="h-4 w-4 text-sky-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">345</div>
						<p className="text-xs text-muted-foreground">+5 this week</p>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/5 dark:to-indigo-900/5 border-indigo-100 dark:border-indigo-900/20 hover:bg-accent/50 transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Monthly Revenue
						</CardTitle>
						<div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
							<DollarSign className="h-4 w-4 text-indigo-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$12,450</div>
						<p className="text-xs text-muted-foreground">
							+15% from last month
						</p>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/5 dark:to-cyan-900/5 border-cyan-100 dark:border-cyan-900/20 hover:bg-accent/50 transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Pending Records
						</CardTitle>
						<div className="p-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/20">
							<AlertCircle className="h-4 w-4 text-cyan-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">8</div>
						<p className="text-xs text-muted-foreground">Require attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Main content */}
			<div className="grid gap-5">
				{/* Today's appointments and Quick Actions in same row */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Today's appointments */}
					<Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/10 dark:to-blue-900/5 border-blue-100 dark:border-blue-900/20">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Today's Appointments</CardTitle>
									<CardDescription>
										Recent patient appointments scheduled for today
									</CardDescription>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setAppointmentDialogOpen(true)}
								>
									<Plus className="mr-2 h-4 w-4" /> Add New
								</Button>
							</div>
						</CardHeader>
						<CardContent className="px-0">
							<div className="space-y-2 p-2">
								{upcomingAppointments.map((appointment, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-muted"
									>
										<div className="flex items-center gap-3">
											<Avatar className="h-12 w-12 border-2 border-background shadow-sm rounded-full overflow-hidden">
												<AvatarImage
													src={appointment.avatar}
													alt={appointment.patient}
													className="object-cover aspect-square"
												/>
												<AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 font-medium">
													{appointment.patient
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium leading-none mb-1">
													{appointment.patient}
												</p>
												<div className="flex items-center gap-2">
													<Badge
														variant="outline"
														className="text-xs font-normal"
													>
														{appointment.type}
													</Badge>
													<div className="flex items-center text-muted-foreground text-xs">
														<Calendar className="w-3 h-3 mr-1" />{' '}
														{appointment.time}
													</div>
												</div>
											</div>
										</div>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter className="flex justify-between border-t px-3 py-3">
							<div className="text-xs text-muted-foreground">
								Showing {upcomingAppointments.length} of 24 appointments
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs gap-1"
								asChild
							>
								<Link to="/appointments">
									View All <ChevronRight className="h-3 w-3" />
								</Link>
							</Button>
						</CardFooter>
					</Card>

					{/* Quick Actions */}
					<Card className="bg-gradient-to-br from-indigo-50/80 to-indigo-100/50 dark:from-indigo-950/10 dark:to-indigo-900/5 border-indigo-100 dark:border-indigo-900/20">
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks for your practice</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 gap-3">
							{quickActions.map((action, index) => (
								<div
									key={index}
									onClick={action.onClick}
									className={`p-3 rounded-lg ${action.color} hover:opacity-90 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md flex items-center gap-3`}
								>
									<div
										className={`p-2 rounded-full bg-white/60 dark:bg-background/60 ${action.iconColor}`}
									>
										<action.icon className="h-4 w-4" />
									</div>
									<div>
										<h3 className="font-medium text-sm">{action.title}</h3>
										<p className="text-xs text-muted-foreground">
											{action.description}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Three cards in one row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{/* Tasks */}
					<Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/50 dark:from-sky-950/10 dark:to-sky-900/5 border-sky-100 dark:border-sky-900/20">
						<CardHeader>
							<CardTitle>Tasks</CardTitle>
							<CardDescription>Manage your daily tasks</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex gap-2">
									<Input
										placeholder="Add a new task..."
										value={newTodo}
										onChange={(e) => setNewTodo(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && addTodo()}
										className="text-sm"
									/>
									<Button size="icon" onClick={addTodo}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								<div className="space-y-2 max-h-[180px] overflow-y-auto">
									{todos.map((todo) => (
										<div
											key={todo.id}
											className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 group ${
												todo.completed ? 'opacity-60' : ''
											}`}
										>
											<Button
												size="icon"
												variant="ghost"
												className="h-8 w-8"
												onClick={() => toggleTodo(todo.id)}
											>
												<CheckCircle2
													className={`h-4 w-4 ${
														todo.completed
															? 'text-green-500'
															: 'text-muted-foreground'
													}`}
												/>
											</Button>
											{todo.isEditing ? (
												<Input
													className="flex-1 text-sm"
													defaultValue={todo.text}
													onBlur={(e) => updateTodo(todo.id, e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') {
															updateTodo(todo.id, e.currentTarget.value);
														} else if (e.key === 'Escape') {
															updateTodo(todo.id, todo.text);
														}
													}}
													autoFocus
												/>
											) : (
												<span
													className={`flex-1 text-sm ${
														todo.completed ? 'line-through' : ''
													}`}
												>
													{todo.text}
												</span>
											)}
											<div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8"
													onClick={() => startEditing(todo.id)}
												>
													<Edit2 className="h-4 w-4" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8 text-destructive"
													onClick={() => deleteTodo(todo.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Recent Activity */}
					<Card className="bg-gradient-to-br from-slate-50/80 to-blue-100/50 dark:from-slate-950/10 dark:to-blue-900/5 border-slate-100 dark:border-slate-900/20">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest updates and changes</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 max-h-[280px] overflow-y-auto">
								{recentActivity.map((activity, i) => (
									<div key={i} className="flex items-start gap-4">
										<div
											className={`p-2 rounded-full ${activity.color} mt-0.5`}
										>
											<activity.icon
												className={`h-4 w-4 ${activity.iconColor}`}
											/>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">{activity.title}</p>
											<p className="text-xs text-muted-foreground">
												{activity.description}
											</p>
											<p className="text-xs text-muted-foreground">
												{activity.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* AI Assistants Carousel */}
					<Card
						className={`bg-gradient-to-br ${aiAssistants[currentAssistant].color} ${aiAssistants[currentAssistant].borderColor} relative overflow-hidden`}
					>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div
									className={`p-1.5 rounded-full ${aiAssistants[currentAssistant].iconBg}`}
								>
									{(() => {
										const Icon = aiAssistants[currentAssistant].icon;
										return (
											<Icon
												className={`h-4 w-4 ${aiAssistants[currentAssistant].iconColor}`}
											/>
										);
									})()}
								</div>
								{aiAssistants[currentAssistant].name}
							</CardTitle>
							<CardDescription>
								{aiAssistants[currentAssistant].description}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{aiAssistants[currentAssistant].features.map((feature, i) => (
									<div key={i} className="flex items-start gap-3">
										<div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 mt-0.5">
											<CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
										</div>
										<p className="text-sm">{feature}</p>
									</div>
								))}
							</div>
							<div className="bg-white dark:bg-background/60 p-3 rounded-lg border border-opacity-20">
								<p className="text-sm font-medium mb-1">
									{aiAssistants[currentAssistant].name} Premium
								</p>
								<p className="text-xs text-muted-foreground mb-3">
									{aiAssistants[currentAssistant].price}/month - Save 20%
									annually
								</p>
								<Button
									className={`w-full ${aiAssistants[currentAssistant].buttonBg} text-white`}
								>
									Get Started
								</Button>
							</div>

							{/* Carousel Navigation */}
							<div className="flex flex-col items-center gap-2 pt-2">
								{/* Progress indicator */}
								<div className="w-full bg-slate-200/30 dark:bg-slate-700/30 h-0.5 rounded-full overflow-hidden">
									<div
										className="bg-white/80 dark:bg-white/80 h-full transition-all duration-300 ease-linear"
										style={{ width: `${rotationProgress}%` }}
									></div>
								</div>

								<div className="flex justify-center gap-2 w-full">
									{aiAssistants.map((_, index) => (
										<Button
											key={index}
											variant="ghost"
											size="icon"
											onClick={() => goToAssistant(index)}
											className={`h-3 w-3 p-0 rounded-full border-2 ${
												index === currentAssistant
													? 'bg-slate-800 border-slate-800 dark:bg-slate-200 dark:border-slate-200'
													: 'bg-transparent border-slate-500/70 hover:border-slate-700 dark:hover:border-slate-300'
											}`}
										/>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<NewAppointmentDialog
				open={appointmentDialogOpen}
				onOpenChange={setAppointmentDialogOpen}
				onSave={handleNewAppointment}
				withButton={false}
			/>

			<NewPatientDialog
				open={patientDialogOpen}
				onOpenChange={setPatientDialogOpen}
				onSave={handleNewPatient}
				withButton={false}
			/>

			<NewMedicalRecordDialog
				open={recordDialogOpen}
				onOpenChange={setRecordDialogOpen}
				onSave={handleNewRecord}
				withButton={false}
			/>

			<NewInvoiceDialog
				open={invoiceDialogOpen}
				onOpenChange={setInvoiceDialogOpen}
				onSave={handleNewInvoice}
				withButton={false}
			/>
		</div>
	);
}
