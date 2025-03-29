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

interface InvoiceFormValues {
	number: string;
	patient: string;
	date: string;
	status: string;
	items: InvoiceItem[];
	notes?: string;
	paymentMethod: string;
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
}

export function NewInvoiceDialog({
	open,
	onOpenChange,
	onSave,
	withButton = true,
}: NewInvoiceDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();
	const form = useForm<InvoiceFormValues>({
		defaultValues: {
			number: `INV-${String(Date.now()).slice(-6)}`,
			patient: '',
			date: new Date().toISOString().split('T')[0],
			status: 'waiting',
			items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
			paymentMethod: '',
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
			});
		}
	};

	return (
		<Dialog
			open={open !== undefined ? open : isOpen}
			onOpenChange={handleOpenChange}
		>
			{withButton && !open && (
				<DialogTrigger asChild>
					<Button>{t('invoices.new')}</Button>
				</DialogTrigger>
			)}
			<DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0 flex flex-col">
				<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
					<div className="flex flex-col space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-1">
									Invoice #{form.watch('number')}
								</div>
								<DialogTitle className="text-2xl">
									{t('invoices.new')}
								</DialogTitle>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								Issue Date: {form.watch('date')}
							</div>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-[150px]">
											<SelectValue>
												{t(
													`invoices.status${
														status.charAt(0).toUpperCase() + status.slice(1)
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
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto">
					<div className="p-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="patient"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('invoices.patient')}</FormLabel>
												<FormControl>
													<Input
														placeholder={t('invoices.patientPlaceholder')}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
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

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold">Items</h3>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={addItem}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Item
										</Button>
									</div>

									<div className="border rounded-lg">
										<table className="w-full">
											<thead>
												<tr className="border-b">
													<th className="text-left p-4">Description</th>
													<th className="text-right p-4">Quantity</th>
													<th className="text-right p-4">Unit Price</th>
													<th className="text-right p-4">Total</th>
													<th className="w-16 p-4"></th>
												</tr>
											</thead>
											<tbody>
												{items.map((item, index) => (
													<tr key={index} className="border-b last:border-0">
														<td className="p-4">
															<Input
																placeholder="Item description"
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
												<span>Total</span>
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
																placeholder={t('invoices.selectPaymentMethod')}
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
	);
}
