import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface Invoice {
	id: number;
	number: string;
	patient: string;
	date: string;
	amount: number;
	status: string;
	items: Array<{
		description: string;
		quantity: number;
		unitPrice: number;
		total: number;
	}>;
	subtotal: number;
	tax: number;
	total: number;
	notes?: string;
	paymentMethod?: string;
}

interface InvoiceDetailsDialogProps {
	invoice: Invoice;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStatusChange: (status: string, id: number) => void;
}

export function InvoiceDetailsDialog({
	invoice,
	open,
	onOpenChange,
	onStatusChange,
}: InvoiceDetailsDialogProps) {
	const { t } = useTranslation();
	const [isExporting, setIsExporting] = useState(false);

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMMM d, yyyy');
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const handleGenerateInvoice = async () => {
		setIsExporting(true);
		try {
			const content = document.getElementById('invoice-content');
			if (!content) return;

			// Add company header before export
			const header = document.createElement('div');
			header.className = 'mb-6 text-center';
			header.innerHTML = `
        <h1 class="text-3xl font-bold mb-2">MedTaskFlow</h1>
        <p class="text-muted-foreground">123 Medical Center Drive</p>
        <p class="text-muted-foreground">New York, NY 10001</p>
        <p class="text-muted-foreground">contact@medtaskflow.com</p>
      `;
			content.insertBefore(header, content.firstChild);

			const opt = {
				margin: 1,
				filename: `invoice-${invoice.number}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			};

			await html2pdf().set(opt).from(content).save();

			// Remove the header after export
			content.removeChild(header);

			toast.success(t('invoices.generateSuccess'));
		} catch (error) {
			console.error('Error generating invoice:', error);
			toast.error(t('invoices.generateError'));
		} finally {
			setIsExporting(false);
		}
	};

	const handleStatusChange = (status: string) => {
		onStatusChange(status, invoice.id);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0 flex flex-col">
				<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
					<DialogTitle>Invoice Details</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					<div className="flex flex-col space-y-4 mb-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-semibold">{invoice.patient}</h2>
								<div className="text-sm font-medium text-muted-foreground">
									Invoice #{invoice.number}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								Issue Date: {formatDate(invoice.date)}
							</div>
							<div className="flex items-center gap-4">
								<Select
									value={invoice.status}
									onValueChange={handleStatusChange}
								>
									<SelectTrigger className="w-[150px]">
										<SelectValue>
											{t(
												`invoices.status${
													invoice.status.charAt(0).toUpperCase() +
													invoice.status.slice(1)
												}`
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="waiting">
											{t('invoices.statusWaiting')}
										</SelectItem>
										<SelectItem value="processing">
											{t('invoices.statusProcessing')}
										</SelectItem>
										<SelectItem value="paid">
											{t('invoices.statusPaid')}
										</SelectItem>
										<SelectItem value="cancelled">
											{t('invoices.statusCancelled')}
										</SelectItem>
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									size="sm"
									onClick={handleGenerateInvoice}
									disabled={isExporting}
									className="bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
								>
									{isExporting ? (
										<>
											<svg
												className="mr-2 h-4 w-4 animate-spin text-red-600 dark:text-red-400"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											<span className="text-red-600 dark:text-red-400">
												{t('invoices.generateInvoice')}
											</span>
										</>
									) : (
										<>
											<FileText className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
											<span className="text-red-600 dark:text-red-400">
												{t('invoices.generateInvoice')}
											</span>
										</>
									)}
								</Button>
							</div>
						</div>
					</div>

					<div className="space-y-6" id="invoice-content">
						<div className="border rounded-lg">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left p-4">Description</th>
										<th className="text-right p-4">Quantity</th>
										<th className="text-right p-4">Unit Price</th>
										<th className="text-right p-4">Total</th>
									</tr>
								</thead>
								<tbody>
									{invoice.items.map((item, index) => (
										<tr key={index} className="border-b last:border-0">
											<td className="p-4">{item.description}</td>
											<td className="text-right p-4">{item.quantity}</td>
											<td className="text-right p-4">
												{formatCurrency(item.unitPrice)}
											</td>
											<td className="text-right p-4">
												{formatCurrency(item.total)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="flex justify-end">
							<div className="w-72 space-y-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span>{formatCurrency(invoice.subtotal)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Tax</span>
									<span>{formatCurrency(invoice.tax)}</span>
								</div>
								<Separator />
								<div className="flex justify-between font-bold">
									<span>Total</span>
									<span>{formatCurrency(invoice.total)}</span>
								</div>
							</div>
						</div>

						{(invoice.notes || invoice.paymentMethod) && (
							<>
								<Separator />
								<div className="space-y-4">
									{invoice.paymentMethod && (
										<div>
											<h4 className="font-medium mb-1">Payment Method</h4>
											<p className="text-muted-foreground">
												{invoice.paymentMethod}
											</p>
										</div>
									)}
									{invoice.notes && (
										<div>
											<h4 className="font-medium mb-1">Notes</h4>
											<p className="text-muted-foreground">{invoice.notes}</p>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
