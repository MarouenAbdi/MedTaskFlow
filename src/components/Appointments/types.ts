export type AppointmentType =
	| 'checkup'
	| 'followup'
	| 'consultation'
	| 'emergency';

export interface Appointment {
	id: number;
	patient: string;
	type: AppointmentType;
	time: string;
	duration: number;
}

export interface TimeSlot {
	date: Date;
	time: string;
}

export interface AppointmentTypeOption {
	value: 'all' | AppointmentType;
	label: string;
}

export interface UseAppointmentsReturn {
	currentDate: Date;
	selectedType: string;
	appointments: Appointment[];
	selectedAppointment: Appointment | null;
	editDialogOpen: boolean;
	newAppointmentOpen: boolean;
	selectedTimeSlot: TimeSlot | null;
	isMobile: boolean;
	weekDays: Date[];
	handlePreviousWeek: () => void;
	handleNextWeek: () => void;
	getAppointmentsForTimeSlot: (day: Date, time: string) => Appointment[];
	handleAppointmentClick: (appointment: Appointment) => void;
	handleSaveAppointment: (updatedAppointment: Appointment) => void;
	handleDeleteAppointment: (id: number) => void;
	handleTimeSlotClick: (day: Date, time: string) => void;
	handleNewAppointment: (data: AppointmentFormValues) => void;
	setSelectedType: (type: string) => void;
	setNewAppointmentOpen: (open: boolean) => void;
	setEditDialogOpen: (open: boolean) => void;
	setCurrentDate: (date: Date) => void;
}

export interface AppointmentFormValues {
	patientName: string;
	type: AppointmentType;
	time: string;
	duration: string;
}
