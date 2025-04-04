import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
	addDays,
	format,
	startOfWeek,
	eachDayOfInterval,
	isWeekend,
	isSameDay,
	parse,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { NewAppointmentDialog } from '@/components/modals/new-appointment-dialog';
import { EditAppointmentDialog } from '@/components/modals/edit-appointment-dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Generate time slots from 8 AM to 6 PM
const timeSlots = Array.from({ length: 21 }, (_, i) => {
	const hour = Math.floor(i / 2) + 8;
	const minutes = i % 2 === 0 ? '00' : '30';
	return `${hour.toString().padStart(2, '0')}:${minutes}`;
});

// Sample appointments data
const initialAppointments = [
	// Monday
	{
		id: 1,
		patient: 'Emma Thompson',
		type: 'checkup',
		time: '08:00',
		duration: 30,
	},
	// Tuesday
	{
		id: 5,
		patient: 'Isabella Kim',
		type: 'emergency',
		time: '09:30',
		duration: 45,
	},
	{
		id: 6,
		patient: 'Ethan Patel',
		type: 'consultation',
		time: '11:30',
		duration: 60,
	},
	// Wednesday
	{
		id: 7,
		patient: 'Ava Wilson',
		type: 'checkup',
		time: '08:00',
		duration: 30,
	},
	{
		id: 9,
		patient: 'Mia Garcia',
		type: 'followup',
		time: '10:30',
		duration: 30,
	},
	// Thursday
	{
		id: 11,
		patient: 'Charlotte Brown',
		type: 'checkup',
		time: '10:00',
		duration: 30,
	},
	{
		id: 12,
		patient: 'James Taylor',
		type: 'emergency',
		time: '11:00',
		duration: 45,
	},
	// Friday
	{
		id: 15,
		patient: 'Lily Johnson',
		type: 'emergency',
		time: '11:30',
		duration: 45,
	},
	// Additional appointments with better time distribution
	{
		id: 16,
		patient: 'David Zhang',
		type: 'checkup',
		time: '13:30',
		duration: 30,
	},
	{
		id: 17,
		patient: 'Victoria Adams',
		type: 'followup',
		time: '15:00',
		duration: 30,
	},
	{
		id: 18,
		patient: 'Benjamin Clark',
		type: 'consultation',
		time: '16:00',
		duration: 60,
	},
	{
		id: 20,
		patient: 'Daniel Kim',
		type: 'checkup',
		time: '14:30',
		duration: 30,
	},
];

const appointmentTypes = [
	{ value: 'all', label: 'All Types' },
	{ value: 'checkup', label: 'GENERAL CHECKUP' },
	{ value: 'followup', label: 'FOLLOW-UP' },
	{ value: 'consultation', label: 'CONSULTATION' },
	{ value: 'emergency', label: 'EMERGENCY' },
];

// Type-specific colors with better contrast
const typeColors = {
	checkup:
		'bg-blue-100/90 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200',
	followup:
		'bg-green-100/90 text-green-900 dark:bg-green-900/30 dark:text-green-200',
	consultation:
		'bg-purple-100/90 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200',
	emergency: 'bg-red-100/90 text-red-900 dark:bg-red-900/30 dark:text-red-200',
};

const badgeColors = {
	checkup:
		'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800',
	followup:
		'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800',
	consultation:
		'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800',
	emergency:
		'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800',
};

export function Appointments() {
	const { t } = useTranslation();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedType, setSelectedType] = useState('all');
	const [appointments, setAppointments] = useState(initialAppointments);
	const [selectedAppointment, setSelectedAppointment] = useState<
		(typeof appointments)[0] | null
	>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
		date: Date;
		time: string;
	} | null>(null);
	const [isMobile, setIsMobile] = useState(false);

	// Handle responsive layout
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Get the start of the week for the current date
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

	// Get an array of the weekdays (excluding weekends)
	const weekDays = eachDayOfInterval({
		start: weekStart,
		end: addDays(weekStart, 6),
	}).filter((day) => !isWeekend(day));

	const handlePreviousWeek = () => {
		setCurrentDate((prevDate) => addDays(prevDate, -7));
	};

	const handleNextWeek = () => {
		setCurrentDate((prevDate) => addDays(prevDate, 7));
	};

	const getAppointmentsForTimeSlot = (day: Date, time: string) => {
		return appointments.filter(
			(appointment) =>
				appointment.time === time &&
				(selectedType === 'all' || appointment.type === selectedType)
		);
	};

	const handleAppointmentClick = (appointment: (typeof appointments)[0]) => {
		setSelectedAppointment(appointment);
		setEditDialogOpen(true);
	};

	const handleSaveAppointment = (
		updatedAppointment: (typeof appointments)[0]
	) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appointment) =>
				appointment.id === updatedAppointment.id
					? updatedAppointment
					: appointment
			)
		);
		toast.success('Appointment updated successfully');
	};

	const handleDeleteAppointment = (id: number) => {
		setAppointments((prevAppointments) =>
			prevAppointments.filter((appointment) => appointment.id !== id)
		);
		toast.success('Appointment deleted successfully');
	};

	const handleTimeSlotClick = (day: Date, time: string) => {
		const existingAppointments = getAppointmentsForTimeSlot(day, time);
		if (existingAppointments.length === 0) {
			setSelectedTimeSlot({ date: day, time });
			setNewAppointmentOpen(true);
		}
	};

	const handleNewAppointment = (appointment: (typeof appointments)[0]) => {
		setAppointments((prev) => [...prev, { ...appointment, id: Date.now() }]);
		toast.success('New appointment created successfully');
	};

	const formatAppointmentType = (type: string) => {
		if (type === 'followup') return 'FOLLOW-UP';
		return type.toUpperCase();
	};

	return (
		<div className="flex flex-col space-y-6 min-h-[calc(100vh-8rem)] pb-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">
					{t('nav.appointments')}
				</h2>
				<p className="text-muted-foreground">{t('appointments.description')}</p>
			</div>

			<div
				className={cn(
					'flex flex-wrap gap-4',
					isMobile ? 'flex-col' : 'items-center justify-between'
				)}
			>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" onClick={handlePreviousWeek}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={handleNextWeek}>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<h3 className="text-lg font-semibold">
						{format(weekStart, 'MMMM d')} -{' '}
						{format(addDays(weekStart, 4), 'MMMM d, yyyy')}
					</h3>
				</div>

				<div className="flex items-center gap-4">
					<Select value={selectedType} onValueChange={setSelectedType}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder={t('appointments.type')} />
						</SelectTrigger>
						<SelectContent>
							{appointmentTypes.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button onClick={() => setNewAppointmentOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> {t('appointments.new')}
					</Button>
				</div>
			</div>

			{/* Calendar Container */}
			<div className="border rounded-lg flex-1">
				{isMobile ? (
					// Mobile View - Single Day with Timeline
					<div className="flex flex-col h-full">
						<div className="border-b sticky top-0 bg-background z-10">
							<div className="overflow-x-auto scrollbar-none">
								<div className="flex gap-2 p-2 min-w-max">
									{weekDays.map((day, index) => (
										<Button
											key={index}
											variant={
												isSameDay(day, currentDate) ? 'default' : 'ghost'
											}
											className="min-w-[120px]"
											onClick={() => setCurrentDate(day)}
										>
											<div className="text-center">
												<div>{format(day, 'EEE')}</div>
												<div className="text-sm">{format(day, 'MMM d')}</div>
											</div>
										</Button>
									))}
								</div>
							</div>
						</div>
						<div className="overflow-y-auto flex-1">
							<div className="divide-y">
								{timeSlots.map((time) => {
									const dayAppointments = getAppointmentsForTimeSlot(
										currentDate,
										time
									);
									return (
										<div
											key={time}
											className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
											onClick={() => handleTimeSlotClick(currentDate, time)}
										>
											<div className="text-sm text-muted-foreground mb-2">
												{time}
											</div>
											<div className="space-y-2">
												{dayAppointments.map((appointment) => (
													<div
														key={appointment.id}
														onClick={(e) => {
															e.stopPropagation();
															handleAppointmentClick(appointment);
														}}
														className={cn(
															'rounded-lg p-3 cursor-pointer transition-colors',
															typeColors[
																appointment.type as keyof typeof typeColors
															],
															'hover:opacity-90'
														)}
													>
														<div className="flex items-center justify-between mb-2">
															<div className="font-medium">
																{appointment.patient}
															</div>
															<div className="text-sm text-muted-foreground">
																<Clock className="h-3 w-3 inline-block mr-1" />
																{appointment.duration}min
															</div>
														</div>
														<Badge
															variant="outline"
															className={cn(
																'text-xs',
																badgeColors[
																	appointment.type as keyof typeof badgeColors
																]
															)}
														>
															{formatAppointmentType(appointment.type)}
														</Badge>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				) : (
					// Desktop View - Week Calendar
					<div className="grid grid-cols-[auto_1fr] h-full">
						<div className="border-r bg-muted/50">
							<div className="h-16 border-b bg-muted/50"></div>
							<div className="divide-y">
								{timeSlots.map((time) => (
									<div
										key={time}
										className="h-20 px-2 py-1 text-sm text-muted-foreground bg-muted/50"
									>
										{time}
									</div>
								))}
							</div>
						</div>

						<div className="overflow-x-auto">
							<div className="grid grid-cols-5 h-full min-w-[800px]">
								{weekDays.map((day, index) => (
									<div key={index} className="border-r last:border-r-0">
										<div className="sticky top-0 z-10 bg-background">
											<div className="h-16 border-b p-2 text-center bg-muted/50">
												<div className="font-medium">{format(day, 'EEEE')}</div>
												<div className="text-sm text-muted-foreground mt-1">
													{format(day, 'MMM d')}
												</div>
											</div>
										</div>
										<div>
											{timeSlots.map((time) => {
												const dayAppointments = getAppointmentsForTimeSlot(
													day,
													time
												);
												return (
													<div
														key={time}
														className={cn(
															'h-20 border-b p-1 cursor-pointer hover:bg-accent/50 transition-colors',
															dayAppointments.length > 0 && 'bg-muted/30'
														)}
														onClick={() => handleTimeSlotClick(day, time)}
													>
														{dayAppointments.map((appointment) => (
															<div
																key={appointment.id}
																onClick={(e) => {
																	e.stopPropagation();
																	handleAppointmentClick(appointment);
																}}
																className={cn(
																	'rounded-lg p-2 text-sm mb-1 cursor-pointer transition-colors',
																	typeColors[
																		appointment.type as keyof typeof typeColors
																	],
																	'hover:opacity-90'
																)}
															>
																<div className="font-medium truncate">
																	{appointment.patient}
																</div>
																<div className="flex items-center gap-2">
																	<Badge
																		variant="outline"
																		className={cn(
																			'text-xs',
																			badgeColors[
																				appointment.type as keyof typeof badgeColors
																			]
																		)}
																	>
																		{formatAppointmentType(appointment.type)}
																	</Badge>
																	<span className="text-xs text-muted-foreground">
																		{appointment.duration}min
																	</span>
																</div>
															</div>
														))}
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			<NewAppointmentDialog
				open={newAppointmentOpen}
				onOpenChange={setNewAppointmentOpen}
				onSave={handleNewAppointment}
				selectedTimeSlot={selectedTimeSlot}
				withButton={false}
			/>

			{selectedAppointment && (
				<EditAppointmentDialog
					appointment={selectedAppointment}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSave={handleSaveAppointment}
					onDelete={handleDeleteAppointment}
				/>
			)}
		</div>
	);
}
