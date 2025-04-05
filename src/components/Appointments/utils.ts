import { AppointmentType, AppointmentTypeOption } from './types';

// Generate time slots from 8 AM to 6 PM
export const generateTimeSlots = () => {
	return Array.from({ length: 21 }, (_, i) => {
		const hour = Math.floor(i / 2) + 8;
		const minutes = i % 2 === 0 ? '00' : '30';
		return `${hour.toString().padStart(2, '0')}:${minutes}`;
	});
};

export const appointmentTypes: AppointmentTypeOption[] = [
	{ value: 'all', label: 'All Types' },
	{ value: 'checkup', label: 'GENERAL CHECKUP' },
	{ value: 'followup', label: 'FOLLOW-UP' },
	{ value: 'consultation', label: 'CONSULTATION' },
	{ value: 'emergency', label: 'EMERGENCY' },
];

export const formatAppointmentType = (type: AppointmentType): string => {
	if (type === 'followup') return 'FOLLOW-UP';
	return type.toUpperCase();
};
