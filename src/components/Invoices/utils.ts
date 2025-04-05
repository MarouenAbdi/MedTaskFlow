import { Invoice } from './types';

export const initialInvoices: Invoice[] = [
	{
		id: 1,
		number: 'INV-001',
		patient: 'John Doe',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format',
		date: '2024-03-15',
		dueDate: '2024-04-15',
		amount: 150.0,
		status: 'paid',
		items: [
			{
				description: 'General Consultation',
				quantity: 1,
				unitPrice: 100.0,
				total: 100.0,
			},
			{
				description: 'Blood Test',
				quantity: 1,
				unitPrice: 50.0,
				total: 50.0,
			},
		],
		subtotal: 150.0,
		tax: 0,
		total: 150.0,
		paymentMethod: 'Credit Card',
	},
	{
		id: 2,
		number: 'INV-002',
		patient: 'Sarah Johnson',
		avatar:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&auto=format',
		date: '2024-03-14',
		dueDate: '2024-04-14',
		amount: 350.0,
		status: 'processing',
		items: [
			{
				description: 'Specialist Consultation',
				quantity: 1,
				unitPrice: 200.0,
				total: 200.0,
			},
			{
				description: 'X-Ray',
				quantity: 1,
				unitPrice: 150.0,
				total: 150.0,
			},
		],
		subtotal: 350.0,
		tax: 0,
		total: 350.0,
		paymentMethod: 'Insurance',
	},
	{
		id: 3,
		number: 'INV-003',
		patient: 'Michael Chen',
		avatar:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format',
		date: '2024-03-13',
		dueDate: '2024-04-13',
		amount: 275.0,
		status: 'waiting',
		items: [
			{
				description: 'Follow-up Consultation',
				quantity: 1,
				unitPrice: 150.0,
				total: 150.0,
			},
			{
				description: 'Prescription',
				quantity: 1,
				unitPrice: 125.0,
				total: 125.0,
			},
		],
		subtotal: 275.0,
		tax: 0,
		total: 275.0,
		notes: 'Patient requested itemized receipt for insurance claim',
	},
];

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
};

export const getStatusBadgeVariant = (status: string) => {
	switch (status) {
		case 'paid':
			return 'success';
		case 'processing':
			return 'warning';
		case 'waiting':
			return 'secondary';
		case 'cancelled':
			return 'destructive';
		default:
			return 'secondary';
	}
};
