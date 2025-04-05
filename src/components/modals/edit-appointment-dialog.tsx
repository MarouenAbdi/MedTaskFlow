import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
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
import { useForm } from 'react-hook-form';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Appointment {
	id: number;
	patient: string;
	type: string;
	time: string;
	duration: number;
}

interface EditAppointmentDialogProps {
	appointment: Appointment;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (appointment: Appointment) => void;
	onDelete: (id: number) => void;
}

export function EditAppointmentDialog({
	appointment,
	open,
	onOpenChange,
	onSave,
	onDelete,
}: EditAppointmentDialogProps) {
	const { t } = useTranslation();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const form = useForm({
		defaultValues: {
			...appointment,
		},
	});

	function onSubmit(data: any) {
		onSave({ ...appointment, ...data });
		onOpenChange(false);
	}

	const handleDelete = () => {
		setShowDeleteAlert(true);
	};

	const confirmDelete = () => {
		onDelete(appointment.id);
		setShowDeleteAlert(false);
		onOpenChange(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[500px] p-6">
					<DialogHeader className="mb-4 border-b pb-3">
						<DialogTitle>Edit Appointment</DialogTitle>
					</DialogHeader>
					<div className="overflow-y-auto max-h-[60vh]">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="patient"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Patient</FormLabel>
											<FormControl>
												<Input {...field} />
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
											<FormLabel>Type</FormLabel>
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
													<SelectItem value="checkup">
														General Checkup
													</SelectItem>
													<SelectItem value="followup">Follow-up</SelectItem>
													<SelectItem value="consultation">
														Consultation
													</SelectItem>
													<SelectItem value="emergency">Emergency</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="time"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Time</FormLabel>
											<FormControl>
												<Input type="time" {...field} />
											</FormControl>
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
											<FormControl>
												<Input
													type="number"
													min="15"
													step="15"
													{...field}
													onChange={(e) =>
														field.onChange(parseInt(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</div>
					<div className="flex justify-between items-center mt-6 pt-4 border-t">
						<Button type="button" variant="destructive" onClick={handleDelete}>
							Delete Appointment
						</Button>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="button" onClick={form.handleSubmit(onSubmit)}>
								Save Changes
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							appointment.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
