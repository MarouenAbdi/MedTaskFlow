import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { NewInvoiceDialog } from '@/components/modals/new-invoice-dialog';
import { InvoiceDetailsDialog } from '@/components/modals/invoice-details-dialog';
import { toast } from 'sonner';
import { Download, Printer } from 'lucide-react';

// Sample invoices data
const initialInvoices = [
	{
		id: 1,
		number: 'INV-001',
		patient: 'John Doe',
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

export function Invoices() {
	const { t } = useTranslation();
	const [invoices, setInvoices] = useState(initialInvoices);
	const [selectedInvoice, setSelectedInvoice] = useState<
		(typeof invoices)[0] | null
	>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);

	const handleRowClick = (
		invoice: (typeof invoices)[0],
		e: React.MouseEvent
	) => {
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
			t('invoices.bulkDownloadStarted', { invoices: selectedInvoiceNumbers })
		);
		// TODO: Implement actual bulk download logic
	};

	const handleBulkPrint = () => {
		const selectedInvoiceNumbers = invoices
			.filter((invoice) => selectedInvoices.includes(invoice.id))
			.map((invoice) => invoice.number)
			.join(', ');
		toast.success(
			t('invoices.bulkPrintStarted', { invoices: selectedInvoiceNumbers })
		);
		// TODO: Implement actual bulk print logic
	};

	const handleStatusChange = (newStatus: string, invoiceId: number) => {
		setInvoices((prevInvoices) =>
			prevInvoices.map((invoice) =>
				invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
			)
		);

		// Also update the selected invoice if it's currently being viewed
		if (selectedInvoice?.id === invoiceId) {
			setSelectedInvoice((prev) =>
				prev ? { ...prev, status: newStatus } : null
			);
		}

		toast.success(t('invoices.statusUpdated'));
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	// Helper function to determine badge variant based on status
	const getStatusBadgeVariant = (status: string) => {
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

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">
					{t('nav.invoices')}
				</h2>
				<div className="flex items-center gap-4">
					{selectedInvoices.length > 0 && (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleBulkDownload}
								className="gap-2"
							>
								<Download className="h-4 w-4" />
								{t('invoices.downloadSelected', {
									count: selectedInvoices.length,
								})}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleBulkPrint}
								className="gap-2"
							>
								<Printer className="h-4 w-4" />
								{t('invoices.printSelected', {
									count: selectedInvoices.length,
								})}
							</Button>
						</>
					)}
					<NewInvoiceDialog />
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">
								<Checkbox
									checked={
										selectedInvoices.length === invoices.length
											? true
											: selectedInvoices.length > 0
											? 'indeterminate'
											: false
									}
									onCheckedChange={handleSelectAll}
									aria-label={t('invoices.selectAll')}
								/>
							</TableHead>
							<TableHead>{t('invoices.number')}</TableHead>
							<TableHead>{t('invoices.patient')}</TableHead>
							<TableHead>{t('invoices.date')}</TableHead>
							<TableHead className="text-right">
								{t('invoices.amount')}
							</TableHead>
							<TableHead>{t('invoices.status')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow
								key={invoice.id}
								className="cursor-pointer group hover:bg-accent/50 transition-colors"
								onClick={(e) => handleRowClick(invoice, e)}
							>
								<TableCell className="checkbox-cell">
									<Checkbox
										checked={selectedInvoices.includes(invoice.id)}
										onCheckedChange={(checked) =>
											handleCheckboxChange(checked, invoice.id)
										}
										aria-label={t('invoices.selectInvoice', {
											number: invoice.number,
										})}
										onClick={(e) => e.stopPropagation()}
									/>
								</TableCell>
								<TableCell className="font-medium group-hover:text-primary transition-colors">
									{invoice.number}
								</TableCell>
								<TableCell>{invoice.patient}</TableCell>
								<TableCell>{invoice.date}</TableCell>
								<TableCell className="text-right">
									{formatCurrency(invoice.amount)}
								</TableCell>
								<TableCell>
									<Badge variant={getStatusBadgeVariant(invoice.status)}>
										{t(
											`invoices.status${
												invoice.status.charAt(0).toUpperCase() +
												invoice.status.slice(1)
											}`
										)}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{selectedInvoice && (
				<InvoiceDetailsDialog
					invoice={selectedInvoice}
					open={detailsOpen}
					onOpenChange={setDetailsOpen}
					onStatusChange={handleStatusChange}
				/>
			)}
		</div>
	);
}
