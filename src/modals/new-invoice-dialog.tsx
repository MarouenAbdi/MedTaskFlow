import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { NewPatientDialog } from './new-patient-dialog';

interface InvoiceFormValues {
	number: string;
	patient: string;
	date: string;
	status: string;
	items: InvoiceItem[];
	notes?: string;
	paymentMethod: string;
	fiscalNumber?: string;
	healthNumber?: string;
}

interface InvoiceItem {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

const paymentMethods = [
	{ value: 'card', label: 'Credit Card' },
	{ value: 'cash', label: 'Cash' },
	{ value: 'insurance', label: 'Insurance' },
	{ value: 'bank', label: 'Bank Transfer' },
];

interface NewInvoiceDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSave?: (data: InvoiceFormValues) => void;
	withButton?: boolean;
	children?: React.ReactNode;
}

// Sample patients data
const samplePatients = [
	{ id: 1, name: 'John Doe' },
	{ id: 2, name: 'Sarah Johnson' },
	{ id: 3, name: 'Michael Chen' },
	{ id: 4, name: 'Emily Davis' },
	{ id: 5, name: 'Robert Wilson' },
];

export function NewInvoiceDialog({
	open,
	onOpenChange,
	onSave,
	withButton = true,
	children,
}: NewInvoiceDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
	const { t } = useTranslation();
	const form = useForm<InvoiceFormValues>({
		defaultValues: {
			number: `INV-${String(Date.now()).slice(-6)}`,
			patient: '',
			date: new Date().toISOString().split('T')[0],
			status: 'waiting',
			items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
			paymentMethod: '',
			fiscalNumber: '',
			healthNumber: '',
		},
	});

	const items = form.watch('items');
	const status = form.watch('status');

	const calculateTotal = (items: InvoiceItem[]) => {
		return items.reduce((sum, item) => sum + item.total, 0);
	};

	const handleQuantityChange = (index: number, value: number) => {
		const items = form.getValues('items');
		const item = items[index];
		item.quantity = value;
		item.total = value * item.unitPrice;
		form.setValue('items', items);
	};

	const handleUnitPriceChange = (index: number, value: number) => {
		const items = form.getValues('items');
		const item = items[index];
		item.unitPrice = value;
		item.total = value * item.quantity;
		form.setValue('items', items);
	};

	const addItem = () => {
		const items = form.getValues('items');
		form.setValue('items', [
			...items,
			{ description: '', quantity: 1, unitPrice: 0, total: 0 },
		]);
	};

	const removeItem = (index: number) => {
		const items = form.getValues('items');
		if (items.length > 1) {
			form.setValue(
				'items',
				items.filter((_, i) => i !== index)
			);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	function onSubmit(data: InvoiceFormValues) {
		if (onSave) {
			onSave(data);
		}
		if (onOpenChange) {
			onOpenChange(false);
		} else {
			setIsOpen(false);
		}
		form.reset();
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (onOpenChange) {
			onOpenChange(newOpen);
		} else {
			setIsOpen(newOpen);
		}
		if (!newOpen) {
			form.reset({
				number: `INV-${String(Date.now()).slice(-6)}`,
				patient: '',
				date: new Date().toISOString().split('T')[0],
				status: 'waiting',
				items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
				paymentMethod: '',
				fiscalNumber: '',
				healthNumber: '',
			});
		}
	};

	const handleNewPatientSave = (data: { name: string }) => {
		form.setValue('patient', data.name);
		setNewPatientDialogOpen(false);
	};

	// Patient dropdown component
	const PatientDropdown = () => {
		const [searchTerm, setSearchTerm] = useState('');
		const [dropdownOpen, setDropdownOpen] = useState(false);

		const filteredPatients = samplePatients.filter((patient) =>
			patient.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchTerm(value);
			form.setValue('patient', value);
			setDropdownOpen(true);
		};

		const handleInputFocus = () => {
			setDropdownOpen(true);
		};

		const handleInputBlur = () => {
			setTimeout(() => {
				setDropdownOpen(false);
			}, 200);
		};

		const handleAddNewPatient = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDropdownOpen(false);
			setNewPatientDialogOpen(true);
		};

		return (
			<FormField
				control={form.control}
				name="patient"
				render={() => (
					<FormItem>
						<FormLabel>{t('invoices.patient')}</FormLabel>
						<div className="relative">
							<Input
								placeholder={t('invoices.patientPlaceholder')}
								value={searchTerm}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								onBlur={handleInputBlur}
							/>
							{dropdownOpen && (
								<div className="absolute bg-white dark:bg-gray-800 border rounded shadow-md mt-1 w-full z-50">
									{filteredPatients.length > 0 ? (
										filteredPatients.map((patient) => (
											<div
												key={patient.id}
												className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
												onMouseDown={(e) => {
													e.preventDefault();
													setSearchTerm(patient.name);
													form.setValue('patient', patient.name);
													setDropdownOpen(false);
												}}
											>
												{patient.name}
											</div>
										))
									) : (
										<div className="px-2 py-1 text-gray-500">
											{t('patients.noResults')}
										</div>
									)}
									<div className="px-2 py-1.5 border-t">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="w-full justify-start"
											onMouseDown={handleAddNewPatient}
										>
											<Plus className="mr-2 h-4 w-4" />
											{t('patients.addNew')}
										</Button>
									</div>
								</div>
							)}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	};

	return (
		<>
			<Dialog
				open={open !== undefined ? open : isOpen}
				onOpenChange={handleOpenChange}
			>
				{withButton && !open && (
					<DialogTrigger asChild>
						{children || <Button>{t('invoices.new')}</Button>}
					</DialogTrigger>
				)}
				<DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0 flex flex-col">
					<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
						<DialogTitle>{t('invoices.new')}</DialogTitle>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto">
						<div className="p-6">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div className="flex items-center justify-between mb-4">
										<div>
											<div className="text-sm font-medium text-muted-foreground mb-1">
												{t('invoices.number')} {form.watch('number')}
											</div>
											<div className="text-sm text-muted-foreground">
												{t('invoices.issueDate')}: {form.watch('date')}
											</div>
										</div>
										<FormField
											control={form.control}
											name="status"
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="w-[150px]">
														<SelectValue>
															{t(
																`invoices.status${
																	status.charAt(0).toUpperCase() +
																	status.slice(1)
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
											)}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<PatientDropdown />
										<FormField
											control={form.control}
											name="date"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t('invoices.date')}</FormLabel>
													<FormControl>
														<Input type="date" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="fiscalNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t('invoices.fiscalNumberAbbr')}
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t('invoices.fiscalNumberAbbr')}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="healthNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t('invoices.healthNumberAbbr')}
													</FormLabel>
													<FormControl>
														<Input
															placeholder={t('invoices.healthNumberAbbr')}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="font-semibold">
												{t('invoices.items.description')}
											</h3>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addItem}
											>
												<Plus className="h-4 w-4 mr-2" />
												{t('common.new')}
											</Button>
										</div>

										<div className="border rounded-lg">
											<table className="w-full">
												<thead>
													<tr className="border-b">
														<th className="text-left p-4">
															{t('invoices.items.description')}
														</th>
														<th className="text-right p-4">
															{t('invoices.items.quantity')}
														</th>
														<th className="text-right p-4">
															{t('invoices.items.unitPrice')}
														</th>
														<th className="text-right p-4">
															{t('invoices.items.total')}
														</th>
														<th className="w-16 p-4"></th>
													</tr>
												</thead>
												<tbody>
													{items.map((item, index) => (
														<tr key={index} className="border-b last:border-0">
															<td className="p-4">
																<Input
																	placeholder={t('invoices.items.description')}
																	value={item.description}
																	onChange={(e) => {
																		const items = form.getValues('items');
																		items[index].description = e.target.value;
																		form.setValue('items', items);
																	}}
																/>
															</td>
															<td className="p-4">
																<Input
																	type="number"
																	min="1"
																	className="w-24 text-right"
																	value={item.quantity}
																	onChange={(e) =>
																		handleQuantityChange(
																			index,
																			Number(e.target.value)
																		)
																	}
																/>
															</td>
															<td className="p-4">
																<Input
																	type="number"
																	min="0"
																	step="0.01"
																	className="w-32 text-right"
																	value={item.unitPrice}
																	onChange={(e) =>
																		handleUnitPriceChange(
																			index,
																			Number(e.target.value)
																		)
																	}
																/>
															</td>
															<td className="p-4 text-right font-medium">
																{formatCurrency(item.total)}
															</td>
															<td className="p-4">
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() => removeItem(index)}
																	disabled={items.length === 1}
																>
																	<Trash2 className="h-4 w-4 text-muted-foreground" />
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>

										<div className="flex justify-end">
											<div className="w-72">
												<div className="flex justify-between font-bold">
													<span>{t('invoices.total')}</span>
													<span>{formatCurrency(calculateTotal(items))}</span>
												</div>
											</div>
										</div>
									</div>

									<Separator />

									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="paymentMethod"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t('invoices.paymentMethod')}</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	placeholder={t(
																		'invoices.selectPaymentMethod'
																	)}
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{paymentMethods.map((method) => (
																<SelectItem
																	key={method.value}
																	value={method.value}
																>
																	{t(
																		`invoices.payment${method.label.replace(
																			/\s+/g,
																			''
																		)}`
																	)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="notes"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t('common.notes')}</FormLabel>
													<FormControl>
														<Input
															placeholder={t('common.notesPlaceholder')}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex justify-end pt-4 border-t">
										<Button type="submit">{t('invoices.save')}</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<NewPatientDialog
				open={newPatientDialogOpen}
				onOpenChange={setNewPatientDialogOpen}
				onSave={handleNewPatientSave}
				withButton={false}
			/>
		</>
	);
}
