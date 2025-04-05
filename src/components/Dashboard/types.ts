import { LucideIcon } from 'lucide-react';

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
	isEditing?: boolean;
}

export interface Appointment {
	patient: string;
	time: string;
	type: string;
	avatar?: string;
}

export interface Activity {
	title: string;
	description: string;
	icon: LucideIcon;
	color: string;
	iconColor: string;
	time: string;
}

export interface AiAssistant {
	name: string;
	description: string;
	features: string[];
	price: string;
	color: string;
	borderColor: string;
	icon: LucideIcon;
	iconBg: string;
	iconColor: string;
	buttonBg: string;
}

export interface QuickAction {
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
	iconColor: string;
	onClick: () => void;
}

export interface DialogStates {
	newAppointment: boolean;
	newPatient: boolean;
	newRecord: boolean;
	newInvoice: boolean;
}
