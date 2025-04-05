import { DateRange as DayPickerDateRange } from 'react-day-picker';

export interface InvoiceItem {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface Invoice {
	id: number;
	number: string;
	patient: string;
	avatar?: string;
	date: string;
	dueDate: string;
	amount: number;
	status: string;
	items: InvoiceItem[];
	subtotal: number;
	tax: number;
	total: number;
	paymentMethod?: string;
	notes?: string;
}

export type DateRange = DayPickerDateRange;
