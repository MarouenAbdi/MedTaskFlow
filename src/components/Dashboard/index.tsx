import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
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
import { NewAppointmentDialog } from '@/modals/new-appointment-dialog';
import { NewPatientDialog } from '@/modals/new-patient-dialog';
import { NewMedicalRecordDialog } from '@/modals/new-medical-record-dialog';
import { NewInvoiceDialog } from '@/modals/new-invoice-dialog';
import { useDashboard } from './hooks/useDashboard';
import { styles } from './styles';
import {
	upcomingAppointments,
	recentActivity,
	aiAssistants,
	quickActions,
} from './utils';

export default function Dashboard() {
	const { t } = useTranslation();
	const {
		todos,
		newTodo,
		currentAssistant,
		rotationProgress,
		dialogStates,
		setNewTodo,
		addTodo,
		toggleTodo,
		startEditing,
		updateTodo,
		deleteTodo,
		goToAssistant,
		handleNewAppointment,
		handleNewPatient,
		handleNewRecord,
		handleNewInvoice,
		setDialogStates,
	} = useDashboard();

	return (
		<div className={styles.container}>
			{/* Welcome header */}
			<div className={styles.header.wrapper}>
				<Avatar className={styles.header.avatar}>
					<AvatarFallback className={styles.header.avatarFallback}>
						<LayoutDashboard className={styles.header.icon} />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className={styles.header.title}>Dashboard</h2>
					<p className={styles.header.description}>
						Welcome to your medical practice management dashboard
					</p>
				</div>
			</div>

			{/* Stats cards */}
			<div className={styles.stats.wrapper}>
				<Card className={styles.stats.card('blue')}>
					<CardHeader className={styles.stats.header}>
						<CardTitle className={styles.stats.title}>
							Total Appointments
						</CardTitle>
						<div className={styles.stats.iconWrapper('blue')}>
							<Calendar className={styles.stats.icon('blue')} />
						</div>
					</CardHeader>
					<CardContent>
						<div className={styles.stats.value}>24</div>
						<p className={styles.stats.trend}>+15% from last month</p>
					</CardContent>
				</Card>

				<Card className={styles.stats.card('sky')}>
					<CardHeader className={styles.stats.header}>
						<CardTitle className={styles.stats.title}>
							Active Patients
						</CardTitle>
						<div className={styles.stats.iconWrapper('sky')}>
							<Users className={styles.stats.icon('sky')} />
						</div>
					</CardHeader>
					<CardContent>
						<div className={styles.stats.value}>345</div>
						<p className={styles.stats.trend}>+5 this week</p>
					</CardContent>
				</Card>

				<Card className={styles.stats.card('indigo')}>
					<CardHeader className={styles.stats.header}>
						<CardTitle className={styles.stats.title}>
							Monthly Revenue
						</CardTitle>
						<div className={styles.stats.iconWrapper('indigo')}>
							<DollarSign className={styles.stats.icon('indigo')} />
						</div>
					</CardHeader>
					<CardContent>
						<div className={styles.stats.value}>$12,450</div>
						<p className={styles.stats.trend}>+15% from last month</p>
					</CardContent>
				</Card>

				<Card className={styles.stats.card('cyan')}>
					<CardHeader className={styles.stats.header}>
						<CardTitle className={styles.stats.title}>
							Pending Records
						</CardTitle>
						<div className={styles.stats.iconWrapper('cyan')}>
							<AlertCircle className={styles.stats.icon('cyan')} />
						</div>
					</CardHeader>
					<CardContent>
						<div className={styles.stats.value}>8</div>
						<p className={styles.stats.trend}>Require attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Main content */}
			<div className={styles.content.wrapper}>
				{/* Today's appointments and Quick Actions */}
				<div className={styles.content.row}>
					{/* Today's appointments */}
					<Card className={styles.appointments.card}>
						<CardHeader className={styles.appointments.header}>
							<div className={styles.appointments.headerContent}>
								<div>
									<CardTitle>Today's Appointments</CardTitle>
									<CardDescription>
										Recent patient appointments scheduled for today
									</CardDescription>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										setDialogStates({ ...dialogStates, appointment: true })
									}
								>
									<Plus className={styles.appointments.addIcon} /> Add New
								</Button>
							</div>
						</CardHeader>
						<CardContent className={styles.appointments.content}>
							<div className={styles.appointments.list}>
								{upcomingAppointments.map((appointment, index) => (
									<div key={index} className={styles.appointments.item}>
										<div className={styles.appointments.itemContent}>
											<Avatar className={styles.appointments.avatar}>
												<AvatarImage
													src={appointment.avatar}
													alt={appointment.patient}
												/>
												<AvatarFallback
													className={styles.appointments.avatarFallback}
												>
													{appointment.patient
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className={styles.appointments.patientName}>
													{appointment.patient}
												</p>
												<div className={styles.appointments.details}>
													<Badge
														variant="outline"
														className={styles.appointments.type}
													>
														{appointment.type}
													</Badge>
													<div className={styles.appointments.time}>
														<Calendar
															className={styles.appointments.timeIcon}
														/>
														{appointment.time}
													</div>
												</div>
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className={styles.appointments.moreButton}
										>
											<MoreHorizontal
												className={styles.appointments.moreIcon}
											/>
										</Button>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter className={styles.appointments.footer}>
							<div className={styles.appointments.footerText}>
								Showing {upcomingAppointments.length} of 24 appointments
							</div>
							<Button
								variant="ghost"
								size="sm"
								className={styles.appointments.viewAllButton}
								asChild
							>
								<Link to="/appointments">
									View All{' '}
									<ChevronRight className={styles.appointments.viewAllIcon} />
								</Link>
							</Button>
						</CardFooter>
					</Card>

					{/* Quick Actions */}
					<Card className={styles.quickActions.card}>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks for your practice</CardDescription>
						</CardHeader>
						<CardContent className={styles.quickActions.content}>
							{quickActions.map((action, index) => (
								<div
									key={index}
									onClick={action.onClick}
									className={styles.quickActions.item(action.color)}
								>
									<div className={styles.quickActions.icon(action.iconColor)}>
										<action.icon className={styles.quickActions.iconSize} />
									</div>
									<div>
										<h3 className={styles.quickActions.title}>
											{action.title}
										</h3>
										<p className={styles.quickActions.description}>
											{action.description}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Tasks, Activity, and AI Assistants */}
				<div className={styles.content.threeColumns}>
					{/* Tasks */}
					<Card className={styles.tasks.card}>
						<CardHeader>
							<CardTitle>Tasks</CardTitle>
							<CardDescription>Manage your daily tasks</CardDescription>
						</CardHeader>
						<CardContent>
							<div className={styles.tasks.content}>
								<div className={styles.tasks.inputWrapper}>
									<Input
										placeholder="Add a new task..."
										value={newTodo}
										onChange={(e) => setNewTodo(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && addTodo()}
										className={styles.tasks.input}
									/>
									<Button size="icon" onClick={addTodo}>
										<Plus className={styles.tasks.addIcon} />
									</Button>
								</div>
								<div className={styles.tasks.list}>
									{todos.map((todo) => (
										<div
											key={todo.id}
											className={styles.tasks.item(todo.completed)}
										>
											<Button
												size="icon"
												variant="ghost"
												className={styles.tasks.checkButton}
												onClick={() => toggleTodo(todo.id)}
											>
												<CheckCircle2
													className={styles.tasks.checkIcon(todo.completed)}
												/>
											</Button>
											{todo.isEditing ? (
												<Input
													className={styles.tasks.editInput}
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
												<span className={styles.tasks.text(todo.completed)}>
													{todo.text}
												</span>
											)}
											<div className={styles.tasks.actions}>
												<Button
													size="icon"
													variant="ghost"
													className={styles.tasks.actionButton}
													onClick={() => startEditing(todo.id)}
												>
													<Edit2 className={styles.tasks.actionIcon} />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className={styles.tasks.deleteButton}
													onClick={() => deleteTodo(todo.id)}
												>
													<Trash2 className={styles.tasks.deleteIcon} />
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Recent Activity */}
					<Card className={styles.activity.card}>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest updates and changes</CardDescription>
						</CardHeader>
						<CardContent>
							<div className={styles.activity.list}>
								{recentActivity.map((activity, i) => (
									<div key={i} className={styles.activity.item}>
										<div className={styles.activity.icon(activity.color)}>
											<activity.icon
												className={styles.activity.iconSize(activity.iconColor)}
											/>
										</div>
										<div className={styles.activity.content}>
											<p className={styles.activity.title}>{activity.title}</p>
											<p className={styles.activity.description}>
												{activity.description}
											</p>
											<p className={styles.activity.time}>{activity.time}</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* AI Assistants Carousel */}
					<Card
						className={styles.aiAssistants.card(aiAssistants[currentAssistant])}
					>
						<CardHeader>
							<CardTitle className={styles.aiAssistants.title}>
								<div
									className={styles.aiAssistants.icon(
										aiAssistants[currentAssistant]
									)}
								>
									{(() => {
										const Icon = aiAssistants[currentAssistant].icon;
										return (
											<Icon
												className={styles.aiAssistants.iconSize(
													aiAssistants[currentAssistant]
												)}
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
						<CardContent className={styles.aiAssistants.content}>
							<div className={styles.aiAssistants.features}>
								{aiAssistants[currentAssistant].features.map((feature, i) => (
									<div key={i} className={styles.aiAssistants.feature}>
										<div className={styles.aiAssistants.featureIcon}>
											<CheckCircle2 className={styles.aiAssistants.checkIcon} />
										</div>
										<p className={styles.aiAssistants.featureText}>{feature}</p>
									</div>
								))}
							</div>
							<div className={styles.aiAssistants.pricing}>
								<p className={styles.aiAssistants.pricingTitle}>
									{aiAssistants[currentAssistant].name} Premium
								</p>
								<p className={styles.aiAssistants.pricingSubtitle}>
									{aiAssistants[currentAssistant].price}/month - Save 20%
									annually
								</p>
								<Button
									className={styles.aiAssistants.button(
										aiAssistants[currentAssistant]
									)}
								>
									Get Started
								</Button>
							</div>

							{/* Carousel Navigation */}
							<div className={styles.aiAssistants.navigation}>
								<div className={styles.aiAssistants.progress}>
									<div
										className={styles.aiAssistants.progressBar}
										style={{ width: `${rotationProgress}%` }}
									></div>
								</div>

								<div className={styles.aiAssistants.dots}>
									{aiAssistants.map((_, index) => (
										<Button
											key={index}
											variant="ghost"
											size="icon"
											onClick={() => goToAssistant(index)}
											className={styles.aiAssistants.dot(
												index === currentAssistant
											)}
										/>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<NewAppointmentDialog
				open={dialogStates.appointment}
				onOpenChange={(open) =>
					setDialogStates({ ...dialogStates, appointment: open })
				}
				onSave={handleNewAppointment}
				withButton={false}
			/>

			<NewPatientDialog
				open={dialogStates.patient}
				onOpenChange={(open) =>
					setDialogStates({ ...dialogStates, patient: open })
				}
				onSave={handleNewPatient}
				withButton={false}
			/>

			<NewMedicalRecordDialog
				open={dialogStates.record}
				onOpenChange={(open) =>
					setDialogStates({ ...dialogStates, record: open })
				}
				onSave={handleNewRecord}
				withButton={false}
			/>

			<NewInvoiceDialog
				open={dialogStates.invoice}
				onOpenChange={(open) =>
					setDialogStates({ ...dialogStates, invoice: open })
				}
				onSave={handleNewInvoice}
				withButton={false}
			/>
		</div>
	);
}
