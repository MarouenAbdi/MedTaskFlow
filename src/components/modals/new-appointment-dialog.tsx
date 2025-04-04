import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { NewPatientDialog } from './new-patient-dialog';

// Sample patients data
const samplePatients = [
	{ id: 1, name: 'John Doe' },
	{ id: 2, name: 'Sarah Johnson' },
	{ id: 3, name: 'Michael Chen' },
	{ id: 4, name: 'Emily Davis' },
	{ id: 5, name: 'Robert Wilson' },
];

interface AppointmentFormValues {
	patientName: string;
	date: string;
	time: string;
	type: string;
	duration: string;
	notes: string;
}

interface NewAppointmentDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultDate?: Date;
	defaultTime?: string;
	onSave?: (data: AppointmentFormValues) => void;
	withButton?: boolean;
}

export function NewAppointmentDialog({
	open,
	onOpenChange,
	defaultDate,
	defaultTime,
	onSave,
	withButton = true,
}: NewAppointmentDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
	const { t } = useTranslation();
	const form = useForm<AppointmentFormValues>({
		defaultValues: {
			patientName: '',
			date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
			time: defaultTime || '',
			type: '',
			duration: '30',
			notes: '',
		},
	});

	useEffect(() => {
		if (defaultDate) {
			form.setValue('date', format(defaultDate, 'yyyy-MM-dd'));
		}
		if (defaultTime) {
			form.setValue('time', defaultTime);
		}
	}, [defaultDate, defaultTime, form]);

	function onSubmit(data: AppointmentFormValues) {
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
			form.reset();
		}
	};

	const handleNewPatientSave = (data: { name: string }) => {
		form.setValue('patientName', data.name);
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
			form.setValue('patientName', value);
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
				name="patientName"
				render={() => (
					<FormItem>
						<FormLabel>{t('patients.name')}</FormLabel>
						<div className="relative">
							<Input
								placeholder={t('appointments.patientPlaceholder')}
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
													form.setValue('patientName', patient.name);
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
						<Button>{t('appointments.new')}</Button>
					</DialogTrigger>
				)}
				<DialogContent className="max-h-[90vh] p-0">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle>{t('appointments.new')}</DialogTitle>
						<DialogDescription>
							{t('appointments.description')}
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
						<div className="p-6">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<PatientDropdown />
									<FormField
										control={form.control}
										name="date"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('appointments.date')}</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="time"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('appointments.time')}</FormLabel>
												<FormControl>
													<Input type="time" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('appointments.type')}</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																placeholder={t('appointments.selectType')}
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="checkup">
															{t('appointments.typeCheckup')}
														</SelectItem>
														<SelectItem value="followup">
															{t('appointments.typeFollowup')}
														</SelectItem>
														<SelectItem value="consultation">
															{t('appointments.typeConsultation')}
														</SelectItem>
														<SelectItem value="emergency">
															{t('appointments.typeEmergency')}
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="duration"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Duration (minutes)</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="15">15 minutes</SelectItem>
														<SelectItem value="30">30 minutes</SelectItem>
														<SelectItem value="45">45 minutes</SelectItem>
														<SelectItem value="60">1 hour</SelectItem>
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
									<div className="pt-4 flex justify-end">
										<Button type="submit">{t('appointments.save')}</Button>
									</div>
								</form>
							</Form>
						</div>
					</ScrollArea>
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
