import { CalendarPlus, UserPlus, FileText, Receipt } from 'lucide-react';
import {
	Activity,
	AiAssistant,
	Appointment,
	QuickAction,
	DialogStates,
} from './types';

export const upcomingAppointments: Appointment[] = [
	{
		patient: 'Sarah Johnson',
		time: '10:00 AM',
		type: 'Check-up',
		avatar: '/avatars/sarah.jpg',
	},
	{
		patient: 'Michael Brown',
		time: '11:30 AM',
		type: 'Follow-up',
		avatar: '/avatars/michael.jpg',
	},
	{
		patient: 'Emma Davis',
		time: '2:00 PM',
		type: 'Consultation',
		avatar: '/avatars/emma.jpg',
	},
];

export const recentActivity: Activity[] = [
	{
		title: 'Medical Record Updated',
		description: 'Updated patient history for Sarah Johnson',
		icon: FileText,
		color: 'bg-blue-100 dark:bg-blue-900/20',
		iconColor: 'text-blue-600 dark:text-blue-400',
		time: '5 minutes ago',
	},
	{
		title: 'New Patient Registered',
		description: 'Michael Brown added to the system',
		icon: UserPlus,
		color: 'bg-green-100 dark:bg-green-900/20',
		iconColor: 'text-green-600 dark:text-green-400',
		time: '2 hours ago',
	},
	{
		title: 'Appointment Rescheduled',
		description: 'Emma Davis moved to next Tuesday',
		icon: CalendarPlus,
		color: 'bg-yellow-100 dark:bg-yellow-900/20',
		iconColor: 'text-yellow-600 dark:text-yellow-400',
		time: '4 hours ago',
	},
];

export const aiAssistants: AiAssistant[] = [
	{
		name: 'MedScript Pro',
		description: 'AI-powered medical transcription and documentation',
		features: [
			'Real-time voice-to-text',
			'Medical terminology support',
			'Template generation',
		],
		price: '$49/month',
		color:
			'from-blue-50/50 to-blue-100/30 dark:from-blue-950/5 dark:to-blue-900/5',
		borderColor: 'border-blue-100 dark:border-blue-900/20',
		icon: FileText,
		iconBg: 'bg-blue-100 dark:bg-blue-900/20',
		iconColor: 'text-blue-600 dark:text-blue-400',
		buttonBg: 'bg-blue-600 hover:bg-blue-700',
	},
	{
		name: 'DiagnosisAI',
		description: 'Advanced diagnostic assistance and recommendations',
		features: [
			'Symptom analysis',
			'Treatment suggestions',
			'Drug interaction checks',
		],
		price: '$79/month',
		color:
			'from-purple-50/50 to-purple-100/30 dark:from-purple-950/5 dark:to-purple-900/5',
		borderColor: 'border-purple-100 dark:border-purple-900/20',
		icon: FileText,
		iconBg: 'bg-purple-100 dark:bg-purple-900/20',
		iconColor: 'text-purple-600 dark:text-purple-400',
		buttonBg: 'bg-purple-600 hover:bg-purple-700',
	},
];

export const createQuickActions = (
	setDialogStates: React.Dispatch<React.SetStateAction<DialogStates>>
): QuickAction[] => [
	{
		icon: CalendarPlus,
		title: 'Schedule Appointment',
		description: 'Book a new patient appointment',
		color: 'bg-blue-50 dark:bg-blue-900/10',
		iconColor: 'text-blue-600 dark:text-blue-400',
		onClick: () =>
			setDialogStates((prev) => ({ ...prev, newAppointment: true })),
	},
	{
		icon: UserPlus,
		title: 'Add Patient',
		description: 'Register a new patient',
		color: 'bg-green-50 dark:bg-green-900/10',
		iconColor: 'text-green-600 dark:text-green-400',
		onClick: () => setDialogStates((prev) => ({ ...prev, newPatient: true })),
	},
	{
		icon: FileText,
		title: 'Create Record',
		description: 'Add a new medical record',
		color: 'bg-yellow-50 dark:bg-yellow-900/10',
		iconColor: 'text-yellow-600 dark:text-yellow-400',
		onClick: () => setDialogStates((prev) => ({ ...prev, newRecord: true })),
	},
	{
		icon: Receipt,
		title: 'Generate Invoice',
		description: 'Create a new invoice',
		color: 'bg-purple-50 dark:bg-purple-900/10',
		iconColor: 'text-purple-600 dark:text-purple-400',
		onClick: () => setDialogStates((prev) => ({ ...prev, newInvoice: true })),
	},
];
