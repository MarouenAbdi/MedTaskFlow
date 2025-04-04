import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	FormDescription,
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
import { RichTextEditorModal } from './rich-text-editor-modal';
import { Copy, Trash2, Plus, FileText, Image, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface MedicalRecordFormValues {
	patientName: string;
	date: string;
	type: string;
	status: string;
	showSymptoms: boolean;
	symptoms: string;
	showDiagnosis: boolean;
	diagnosis: string;
	showTreatment: boolean;
	treatment: string;
	notes: string;
	attachments: FileList | null;
	showVitals: boolean;
	vitals: {
		bloodPressure: string;
		heartRate: string;
		temperature: string;
		weight: string;
		height: string;
	};
}

interface NewMedicalRecordDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSave?: (data: MedicalRecordFormValues) => void;
	withButton?: boolean;
}

export function NewMedicalRecordDialog({
	open,
	onOpenChange,
	onSave,
	withButton = true,
}: NewMedicalRecordDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [filePreview, setFilePreview] = useState<{ [key: string]: string }>({});

	const form = useForm<MedicalRecordFormValues>({
		defaultValues: {
			patientName: '',
			date: '',
			type: '',
			status: 'notstarted',
			showSymptoms: false,
			symptoms: '',
			showDiagnosis: false,
			diagnosis: '',
			showTreatment: false,
			treatment: '',
			notes: '',
			attachments: null,
			showVitals: false,
			vitals: {
				bloodPressure: '',
				heartRate: '',
				temperature: '',
				weight: '',
				height: '',
			},
		},
	});

	function onSubmit(data: MedicalRecordFormValues) {
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

	const extractTextFromHtml = (html: string) => {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	};

	const RichTextField = ({
		name,
		label,
	}: {
		name: keyof MedicalRecordFormValues;
		label: string;
	}) => {
		const [editorOpen, setEditorOpen] = useState(false);

		const handleCopy = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const content = form.getValues(name);
			const plainText = extractTextFromHtml(content as string);
			navigator.clipboard.writeText(plainText).then(() => {
				toast.success('Content copied to clipboard');
			});
		};

		const handleClear = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			form.setValue(name, '');
		};

		const handleFieldClick = () => {
			setEditorOpen(true);
		};

		return (
			<FormField
				control={form.control}
				name={name}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<div className="relative">
								<div
									role="button"
									tabIndex={0}
									className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm pr-28 cursor-pointer hover:bg-accent/50 transition-colors"
									dangerouslySetInnerHTML={{ __html: field.value as string }}
									onClick={handleFieldClick}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleFieldClick();
										}
									}}
								/>
								<div className="absolute top-2 right-2 flex gap-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={handleCopy}
										className="h-8 w-8"
									>
										<Copy className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={handleClear}
										className="h-8 w-8 text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
									<RichTextEditorModal
										content={field.value as string}
										onChange={field.onChange}
										title={label}
										open={editorOpen}
										onOpenChange={setEditorOpen}
									/>
								</div>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	};

	const toggleSection = (
		section: 'showVitals' | 'showSymptoms' | 'showDiagnosis' | 'showTreatment'
	) => {
		const currentValue = form.getValues(section);
		form.setValue(section, !currentValue);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const newFiles: File[] = Array.from(files);
			setSelectedFiles((prev) => [...prev, ...newFiles]);

			// Generate previews for images
			newFiles.forEach((file) => {
				if (file.type.startsWith('image/')) {
					const reader = new FileReader();
					reader.onloadend = () => {
						setFilePreview((prev) => ({
							...prev,
							[file.name]: reader.result as string,
						}));
					};
					reader.readAsDataURL(file);
				}
			});
		}
	};

	const removeFile = (fileName: string) => {
		setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
		setFilePreview((prev) => {
			const updated = { ...prev };
			delete updated[fileName];
			return updated;
		});
	};

	const getFileIcon = (fileName: string) => {
		const extension = fileName.split('.').pop()?.toLowerCase();

		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
			return <Image className="h-5 w-5 text-blue-500" />;
		} else if (
			['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(
				extension || ''
			)
		) {
			return <FileText className="h-5 w-5 text-red-500" />;
		} else {
			return <FileText className="h-5 w-5 text-gray-500" />;
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' bytes';
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		else return (bytes / 1048576).toFixed(1) + ' MB';
	};

	const renderAttachmentsField = () => (
		<FormField
			control={form.control}
			name="attachments"
			render={({ field }) => (
				<FormItem className="space-y-4">
					<FormLabel>{t('medicalRecords.attachments')}</FormLabel>
					<FormDescription>
						Upload patient-related files such as test results, images, or
						documents
					</FormDescription>
					<div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
						<Upload className="h-10 w-10 text-muted-foreground mb-2" />
						<p className="text-sm text-muted-foreground mb-1">
							Drag & drop files here or click to browse
						</p>
						<p className="text-xs text-muted-foreground mb-4">
							Supports images, PDFs, and documents up to 10MB
						</p>
						<input
							type="file"
							multiple
							className="hidden"
							id="file-upload"
							onChange={(e) => {
								field.onChange(e.target.files);
								handleFileChange(e);
							}}
							accept="image/*,.pdf,.doc,.docx,.txt"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => document.getElementById('file-upload')?.click()}
						>
							Select files
						</Button>
					</div>

					{selectedFiles.length > 0 && (
						<div className="space-y-2 mt-4">
							<p className="text-sm font-medium">Selected files:</p>
							<div className="max-h-60 overflow-y-auto border rounded-md divide-y">
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 group"
									>
										<div className="flex items-center gap-3 overflow-hidden">
											{filePreview[file.name] ? (
												<img
													src={filePreview[file.name]}
													alt={file.name}
													className="h-10 w-10 object-cover rounded"
												/>
											) : (
												<div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
													{getFileIcon(file.name)}
												</div>
											)}
											<div className="overflow-hidden">
												<p className="text-sm font-medium truncate">
													{file.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatFileSize(file.size)}
												</p>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => removeFile(file.name)}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	return (
		<Dialog
			open={open !== undefined ? open : isOpen}
			onOpenChange={handleOpenChange}
		>
			{withButton && !open && (
				<DialogTrigger asChild>
					<Button>{t('medicalRecords.new')}</Button>
				</DialogTrigger>
			)}
			<DialogContent className="max-h-[90vh] p-0">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle>{t('medicalRecords.new')}</DialogTitle>
					<DialogDescription>
						{t('medicalRecords.description')}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
					<div className="p-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="patientName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('patients.name')}</FormLabel>
												<FormControl>
													<Input
														placeholder={t('patients.namePlaceholder')}
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
												<FormLabel>{t('medicalRecords.date')}</FormLabel>
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
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('medicalRecords.type')}</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																placeholder={t('medicalRecords.selectType')}
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="consultation">
															{t('medicalRecords.typeConsultation')}
														</SelectItem>
														<SelectItem value="examination">
															{t('medicalRecords.typeExamination')}
														</SelectItem>
														<SelectItem value="procedure">
															{t('medicalRecords.typeProcedure')}
														</SelectItem>
														<SelectItem value="test">
															{t('medicalRecords.typeTest')}
														</SelectItem>
														<SelectItem value="followup">
															{t('medicalRecords.typeFollowup')}
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('medicalRecords.status')}</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																placeholder={t('medicalRecords.selectStatus')}
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="notstarted">
															{t('medicalRecords.statusNotStarted')}
														</SelectItem>
														<SelectItem value="onhold">
															{t('medicalRecords.statusOnHold')}
														</SelectItem>
														<SelectItem value="pending">
															{t('medicalRecords.statusPending')}
														</SelectItem>
														<SelectItem value="completed">
															{t('medicalRecords.statusCompleted')}
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<RichTextField name="notes" label={t('common.notes')} />

								<div className="flex justify-between items-center mb-2 border-b pb-2">
									<h3 className="text-base font-medium">Other sections</h3>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm">
												<Plus className="h-4 w-4 mr-1" />
												Add section
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuCheckboxItem
												checked={form.watch('showVitals')}
												onCheckedChange={() => toggleSection('showVitals')}
											>
												Vitals and Measurements
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={form.watch('showSymptoms')}
												onCheckedChange={() => toggleSection('showSymptoms')}
											>
												Symptoms
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={form.watch('showDiagnosis')}
												onCheckedChange={() => toggleSection('showDiagnosis')}
											>
												Diagnosis
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={form.watch('showTreatment')}
												onCheckedChange={() => toggleSection('showTreatment')}
											>
												Treatment Plan
											</DropdownMenuCheckboxItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								{form.watch('showVitals') && (
									<div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 h-6 w-6"
											onClick={() => form.setValue('showVitals', false)}
										>
											<span className="sr-only">Remove section</span>×
										</Button>
										<div>
											<h4 className="font-medium mb-4">Vitals</h4>
											<div className="space-y-4 text-sm">
												<FormField
													control={form.control}
													name="vitals.bloodPressure"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Blood Pressure (mmHg)</FormLabel>
															<FormControl>
																<Input placeholder="120/80" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="vitals.heartRate"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Heart Rate (bpm)</FormLabel>
															<FormControl>
																<Input placeholder="70" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="vitals.temperature"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Temperature (°C)</FormLabel>
															<FormControl>
																<Input placeholder="37.0" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
										<div>
											<h4 className="font-medium mb-4">Measurements</h4>
											<div className="space-y-4 text-sm">
												<FormField
													control={form.control}
													name="vitals.weight"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Weight (kg)</FormLabel>
															<FormControl>
																<Input placeholder="70" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="vitals.height"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Height (cm)</FormLabel>
															<FormControl>
																<Input placeholder="175" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
									</div>
								)}

								{form.watch('showSymptoms') && (
									<div className="relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 h-6 w-6 z-10"
											onClick={() => form.setValue('showSymptoms', false)}
										>
											<span className="sr-only">Remove section</span>×
										</Button>
										<RichTextField
											name="symptoms"
											label={t('medicalRecords.symptoms')}
										/>
									</div>
								)}

								{form.watch('showDiagnosis') && (
									<div className="relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 h-6 w-6 z-10"
											onClick={() => form.setValue('showDiagnosis', false)}
										>
											<span className="sr-only">Remove section</span>×
										</Button>
										<RichTextField
											name="diagnosis"
											label={t('medicalRecords.diagnosis')}
										/>
									</div>
								)}

								{form.watch('showTreatment') && (
									<div className="relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 h-6 w-6 z-10"
											onClick={() => form.setValue('showTreatment', false)}
										>
											<span className="sr-only">Remove section</span>×
										</Button>
										<RichTextField
											name="treatment"
											label={t('medicalRecords.treatment')}
										/>
									</div>
								)}

								{renderAttachmentsField()}

								<div className="pt-4 flex justify-end">
									<Button type="submit">{t('medicalRecords.save')}</Button>
								</div>
							</form>
						</Form>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
