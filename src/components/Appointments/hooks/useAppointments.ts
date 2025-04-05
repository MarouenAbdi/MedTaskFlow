import { useState, useEffect } from 'react';
import { addDays, startOfWeek, eachDayOfInterval, isWeekend } from 'date-fns';
import { toast } from 'sonner';
import {
	Appointment,
	AppointmentFormValues,
	TimeSlot,
	UseAppointmentsReturn,
} from '../types';

// Sample appointments data
const initialAppointments: Appointment[] = [
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

export function useAppointments(): UseAppointmentsReturn {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedType, setSelectedType] = useState('all');
	const [appointments, setAppointments] = useState(initialAppointments);
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
		null
	);
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

	const handleAppointmentClick = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setEditDialogOpen(true);
	};

	const handleSaveAppointment = (updatedAppointment: Appointment) => {
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

	const handleNewAppointment = (data: AppointmentFormValues) => {
		const appointment = {
			id: Date.now(),
			patient: data.patientName,
			type: data.type,
			time: data.time,
			duration: parseInt(data.duration),
		};
		setAppointments((prev) => [...prev, appointment]);
		toast.success('New appointment created successfully');
	};

	return {
		currentDate,
		selectedType,
		appointments,
		selectedAppointment,
		editDialogOpen,
		newAppointmentOpen,
		selectedTimeSlot,
		isMobile,
		weekDays,
		handlePreviousWeek,
		handleNextWeek,
		getAppointmentsForTimeSlot,
		handleAppointmentClick,
		handleSaveAppointment,
		handleDeleteAppointment,
		handleTimeSlotClick,
		handleNewAppointment,
		setSelectedType,
		setNewAppointmentOpen,
		setEditDialogOpen,
		setCurrentDate,
	};
}
