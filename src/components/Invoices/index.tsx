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
import { NewInvoiceDialog } from '@/modals/new-invoice-dialog';
import { InvoiceDetailsDialog } from '@/modals/invoice-details-dialog';
import {
	Download,
	Printer,
	Search,
	Calendar as CalendarIcon,
	Plus,
	DollarSign,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInvoices } from './hooks/useInvoices';
import { styles } from './styles';
import { formatCurrency, getStatusBadgeVariant } from './utils';

export default function Invoices() {
	const { t } = useTranslation();
	const {
		invoices,
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
	} = useInvoices();

	return (
		<div className={styles.container}>
			{/* Header */}
			<div className={styles.header.wrapper}>
				<Avatar className={styles.header.avatar}>
					<AvatarFallback className={styles.header.avatarFallback}>
						<DollarSign className={styles.header.icon} />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className={styles.header.title}>{t('nav.invoices')}</h2>
					<p className={styles.header.description}>
						{t('invoices.description')}
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className={styles.actions.wrapper}>
				<div className={styles.actions.search.wrapper}>
					<Search className={styles.actions.search.icon} />
					<Input
						type="search"
						placeholder={t('invoices.searchPlaceholder')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className={styles.actions.search.input}
					/>
				</div>

				<div className={styles.actions.filters.wrapper}>
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className={styles.actions.filters.status}>
							<SelectValue placeholder={t('invoices.filterByStatus')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t('invoices.statusAll')}</SelectItem>
							<SelectItem value="paid">{t('invoices.statusPaid')}</SelectItem>
							<SelectItem value="processing">
								{t('invoices.statusProcessing')}
							</SelectItem>
							<SelectItem value="waiting">
								{t('invoices.statusWaiting')}
							</SelectItem>
							<SelectItem value="cancelled">
								{t('invoices.statusCancelled')}
							</SelectItem>
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={styles.actions.filters.dateRange.button(
									!!dateRange?.from
								)}
							>
								<CalendarIcon
									className={styles.actions.filters.dateRange.icon}
								/>
								{dateRange?.from ? (
									dateRange.to ? (
										<>
											{format(dateRange.from, 'LLL dd, y')} -{' '}
											{format(dateRange.to, 'LLL dd, y')}
										</>
									) : (
										format(dateRange.from, 'LLL dd, y')
									)
								) : (
									<span>{t('invoices.filterByDate')}</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className={styles.actions.filters.dateRange.content}
							align="end"
						>
							<div className={styles.actions.filters.dateRange.header}>
								<p className={styles.actions.filters.dateRange.title}>
									{t('invoices.selectDateRange')}
								</p>
								{dateRange?.from && (
									<Button
										variant="ghost"
										className={styles.actions.filters.dateRange.clearButton}
										onClick={() => setDateRange(undefined)}
									>
										{t('common.clear')}
									</Button>
								)}
							</div>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={setDateRange}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>

					{selectedInvoices.length > 0 && (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleBulkDownload}
								className={styles.actions.bulkActions.button}
							>
								<Download className={styles.actions.bulkActions.icon} />
								{t('invoices.downloadSelected', {
									count: selectedInvoices.length,
								})}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleBulkPrint}
								className={styles.actions.bulkActions.button}
							>
								<Printer className={styles.actions.bulkActions.icon} />
								{t('invoices.printSelected', {
									count: selectedInvoices.length,
								})}
							</Button>
						</>
					)}

					<NewInvoiceDialog>
						<Button className={styles.actions.bulkActions.button}>
							<Plus className={styles.actions.bulkActions.icon} />
							{t('invoices.new')}
						</Button>
					</NewInvoiceDialog>
				</div>
			</div>

			{/* Table */}
			<div className={styles.table.wrapper}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className={styles.table.checkboxCell}>
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
							<TableHead className={styles.table.amount}>
								{t('invoices.amount')}
							</TableHead>
							<TableHead>{t('invoices.status')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow
								key={invoice.id}
								className={styles.table.row}
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
								<TableCell className={styles.table.invoiceNumber}>
									{invoice.number}
								</TableCell>
								<TableCell>
									<div className={styles.table.patient.wrapper}>
										<Avatar>
											{invoice.avatar ? (
												<AvatarImage
													src={invoice.avatar}
													alt={invoice.patient}
												/>
											) : (
												<AvatarFallback
													className={styles.table.patient.avatar.fallback}
												>
													{styles.table.patient.avatar.initials(
														invoice.patient
													)}
												</AvatarFallback>
											)}
										</Avatar>
										<span>{invoice.patient}</span>
									</div>
								</TableCell>
								<TableCell>{invoice.date}</TableCell>
								<TableCell className={styles.table.amount}>
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
