import { useState } from 'react';
import { Invoice, DateRange } from '../types';
import { initialInvoices } from '../utils';
import { toast } from 'sonner';

export const useInvoices = () => {
	const [invoices, setInvoices] = useState(initialInvoices);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [dateRange, setDateRange] = useState<DateRange>();

	const handleRowClick = (invoice: Invoice, e: React.MouseEvent) => {
		// Prevent row click when clicking checkbox
		if ((e.target as HTMLElement).closest('.checkbox-cell')) {
			return;
		}
		setSelectedInvoice(invoice);
		setDetailsOpen(true);
	};

	const handleCheckboxChange = (
		checked: boolean | 'indeterminate',
		invoiceId: number
	) => {
		setSelectedInvoices((prev) =>
			checked ? [...prev, invoiceId] : prev.filter((id) => id !== invoiceId)
		);
	};

	const handleSelectAll = (checked: boolean | 'indeterminate') => {
		setSelectedInvoices(checked ? invoices.map((invoice) => invoice.id) : []);
	};

	const handleBulkDownload = () => {
		const selectedInvoiceNumbers = invoices
			.filter((invoice) => selectedInvoices.includes(invoice.id))
			.map((invoice) => invoice.number)
			.join(', ');
		toast.success(
			'Bulk download started for invoices: ' + selectedInvoiceNumbers
		);
	};

	const handleBulkPrint = () => {
		const selectedInvoiceNumbers = invoices
			.filter((invoice) => selectedInvoices.includes(invoice.id))
			.map((invoice) => invoice.number)
			.join(', ');
		toast.success('Bulk print started for invoices: ' + selectedInvoiceNumbers);
	};

	const handleStatusChange = (newStatus: string, invoiceId: number) => {
		setInvoices((prevInvoices) =>
			prevInvoices.map((invoice) =>
				invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
			)
		);

		if (selectedInvoice?.id === invoiceId) {
			setSelectedInvoice((prev) =>
				prev ? { ...prev, status: newStatus } : null
			);
		}

		toast.success('Invoice status updated successfully');
	};

	const getFilteredInvoices = () => {
		return invoices.filter((invoice) => {
			// Search filter
			const matchesSearch = searchQuery
				? invoice.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
				  invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
				: true;

			// Status filter
			const matchesStatus =
				selectedStatus === 'all' || invoice.status === selectedStatus;

			// Date range filter
			const invoiceDate = new Date(invoice.date);
			const matchesDateRange =
				(!dateRange?.from || invoiceDate >= dateRange.from) &&
				(!dateRange?.to || invoiceDate <= dateRange.to);

			return matchesSearch && matchesStatus && matchesDateRange;
		});
	};

	return {
		invoices: getFilteredInvoices(),
		selectedInvoice,
		detailsOpen,
		selectedInvoices,
		searchQuery,
		selectedStatus,
		dateRange,
		setDetailsOpen,
		setSearchQuery,
		setSelectedStatus,
		setDateRange,
		handleRowClick,
		handleCheckboxChange,
		handleSelectAll,
		handleBulkDownload,
		handleBulkPrint,
		handleStatusChange,
	};
};
