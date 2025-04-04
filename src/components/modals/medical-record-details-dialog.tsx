import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	Download,
	File as FilePdf,
	Mic,
	Copy,
	Eye,
	Edit,
	Save,
	X,
	Upload,
	Image,
	Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { cn, typeVariants } from '@/lib/utils';
import { SessionTranscriptionDialog } from './session-transcription-dialog';
import { FilePreviewDialog } from './file-preview-dialog';
import { RichTextEditorModal } from './rich-text-editor-modal';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface MedicalRecord {
	id: number;
	patient: string;
	patientDateOfBirth: string;
	date: string;
	type: string;
	doctor: string;
	status: string;
	symptoms: string;
	diagnosis: string;
	treatment: string;
	notes: string;
	showVitals?: boolean;
	showSymptoms?: boolean;
	showDiagnosis?: boolean;
	showTreatment?: boolean;
	vitals: {
		bloodPressure: string;
		heartRate: string;
		temperature: string;
		weight: string;
		height: string;
	};
	attachments: Array<{
		name: string;
		type: string;
		size: string;
		url: string;
	}>;
	transcriptions?: Array<{
		id: number;
		date: string;
		content: string;
	}>;
}

interface MedicalRecordDetailsDialogProps {
	record: MedicalRecord;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (record: MedicalRecord) => void;
}

export function MedicalRecordDetailsDialog({
	record,
	open,
	onOpenChange,
	onSave,
}: MedicalRecordDetailsDialogProps) {
	const { t } = useTranslation();
	const [isExporting, setIsExporting] = useState(false);
	const [transcriptionDialogOpen, setTranscriptionDialogOpen] = useState(false);
	const [localRecord, setLocalRecord] = useState<MedicalRecord>(record);
	const [previewFile, setPreviewFile] = useState<{
		name: string;
		type: string;
		url: string;
	} | null>(null);
	const [filePreviewOpen, setFilePreviewOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [filePreview, setFilePreview] = useState<{ [key: string]: string }>({});

	// Rich text editor states
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [editorContent, setEditorContent] = useState('');
	const [editorFieldName, setEditorFieldName] = useState('');

	// Form for structured fields
	const form = useForm({
		defaultValues: {
			doctor: record.doctor,
			type: record.type,
			status: record.status,
			showVitals: record.showVitals ?? false,
			showSymptoms: record.showSymptoms ?? true,
			showDiagnosis: record.showDiagnosis ?? true,
			showTreatment: record.showTreatment ?? true,
			vitals: {
				bloodPressure: record.vitals.bloodPressure,
				heartRate: record.vitals.heartRate,
				temperature: record.vitals.temperature,
				weight: record.vitals.weight,
				height: record.vitals.height,
			},
		},
	});

	// Update local record when the prop changes
	useEffect(() => {
		setLocalRecord(record);
		form.reset({
			doctor: record.doctor,
			type: record.type,
			status: record.status,
			showVitals: record.showVitals ?? false,
			showSymptoms: record.showSymptoms ?? true,
			showDiagnosis: record.showDiagnosis ?? true,
			showTreatment: record.showTreatment ?? true,
			vitals: {
				bloodPressure: record.vitals.bloodPressure,
				heartRate: record.vitals.heartRate,
				temperature: record.vitals.temperature,
				weight: record.vitals.weight,
				height: record.vitals.height,
			},
		});
	}, [record, form]);

	const handleDownload = (fileName: string) => {
		// In a real app, this would trigger a file download
		console.log(`Downloading ${fileName}`);
		toast.success(`Downloading ${fileName}`);
	};

	const getTypeTranslation = (type: string) => {
		return t(
			`medicalRecords.type${type.charAt(0).toUpperCase() + type.slice(1)}`
		);
	};

	const getStatusTranslation = (status: string) => {
		return t(
			`medicalRecords.status${status.charAt(0).toUpperCase() + status.slice(1)}`
		);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMMM d, yyyy');
	};

	// Helper function to determine badge variant based on status
	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'notstarted':
				return 'secondary';
			case 'pending':
				return 'warning';
			case 'onhold':
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	const handleExportToPDF = async () => {
		setIsExporting(true);
		try {
			const content = document.getElementById('medical-record-content');
			if (!content) return;

			// Add patient header before export
			const header = document.createElement('div');
			header.className = 'mb-6 text-center';
			header.innerHTML = `
        <h1 class="text-2xl font-bold mb-2">${localRecord.patient}</h1>
        <p class="text-muted-foreground">Date of Birth: ${formatDate(
					localRecord.patientDateOfBirth
				)}</p>
        <p class="text-muted-foreground">Record Date: ${formatDate(
					localRecord.date
				)}</p>
      `;
			content.insertBefore(header, content.firstChild);

			const opt = {
				margin: 1,
				filename: `medical-record-${localRecord.id}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			};

			await html2pdf().set(opt).from(content).save();

			// Remove the header after export
			content.removeChild(header);

			toast.success(t('medicalRecords.exportSuccess'));
		} catch (error) {
			console.error('Error exporting to PDF:', error);
			toast.error(t('medicalRecords.exportError'));
		} finally {
			setIsExporting(false);
		}
	};

	const handleSaveTranscription = (transcription: string) => {
		const newTranscription = {
			id: Date.now(),
			date: new Date().toISOString(),
			content: transcription,
		};

		const updatedRecord = {
			...localRecord,
			transcriptions: [...(localRecord.transcriptions || []), newTranscription],
		};

		setLocalRecord(updatedRecord);
		onSave(updatedRecord);
	};

	const handlePreviewFile = (
		attachment: (typeof localRecord.attachments)[0]
	) => {
		// For demo purposes, use a sample URL for attachments without URLs
		const url =
			attachment.url ||
			(attachment.type === 'pdf'
				? 'https://arxiv.org/pdf/2307.09288.pdf'
				: attachment.type === 'image'
				? 'https://images.unsplash.com/photo-1516069677018-378971e2d685?w=800&h=600&fit=crop'
				: '');

		if (attachment.type === 'pdf' || attachment.type === 'image') {
			// For PDFs, use Google Docs viewer for reliable display in iframe
			const finalUrl =
				attachment.type === 'pdf'
					? `https://docs.google.com/viewer?url=${encodeURIComponent(
							url
					  )}&embedded=true&navpanes=0&toolbar=0`
					: url;

			setPreviewFile({
				name: attachment.name,
				type: attachment.type,
				url: finalUrl,
			});

			setFilePreviewOpen(true);
			console.log('Opening file for preview:', attachment.name);
		} else {
			// Fallback for unsupported file types
			toast.error('This file type cannot be previewed');
		}
	};

	const handleEditField = (fieldName: string, content: string) => {
		setEditorFieldName(fieldName);
		setEditorContent(content);
		setIsEditorOpen(true);
	};

	const handleEditorSave = (content: string) => {
		setLocalRecord((prev) => ({
			...prev,
			[editorFieldName]: content,
		}));
		setEditorContent('');
		setEditorFieldName('');
	};

	const handleSaveChanges = () => {
		const formData = form.getValues();

		const updatedRecord = {
			...localRecord,
			doctor: formData.doctor,
			type: formData.type,
			status: formData.status,
			showVitals: formData.showVitals,
			showSymptoms: formData.showSymptoms,
			showDiagnosis: formData.showDiagnosis,
			showTreatment: formData.showTreatment,
			vitals: formData.vitals,
		};

		setLocalRecord(updatedRecord);
		setIsEditMode(false);
		onSave(updatedRecord);
	};

	const handleCancelEdit = () => {
		setIsEditMode(false);
		form.reset({
			doctor: record.doctor,
			type: record.type,
			status: record.status,
			showVitals: record.showVitals ?? false,
			showSymptoms: record.showSymptoms ?? true,
			showDiagnosis: record.showDiagnosis ?? true,
			showTreatment: record.showTreatment ?? true,
			vitals: {
				bloodPressure: record.vitals.bloodPressure,
				heartRate: record.vitals.heartRate,
				temperature: record.vitals.temperature,
				weight: record.vitals.weight,
				height: record.vitals.height,
			},
		});
		setLocalRecord(record);
	};

	const toggleSection = (
		section: 'showVitals' | 'showSymptoms' | 'showDiagnosis' | 'showTreatment'
	) => {
		const currentValue = form.getValues(section);
		form.setValue(section, !currentValue);

		// Update local record to reflect changes
		setLocalRecord({
			...localRecord,
			[section]: !currentValue,
		});
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

			// In a real app, you would upload these files to a server
			// and update the attachments array
			const mockAttachments = newFiles.map((file) => ({
				name: file.name,
				type: file.type.startsWith('image/') ? 'image' : 'pdf',
				size: formatFileSize(file.size),
				url: URL.createObjectURL(file),
			}));

			setLocalRecord({
				...localRecord,
				attachments: [...localRecord.attachments, ...mockAttachments],
			});
		}
	};

	const removeFile = (fileName: string) => {
		// Remove from attachments in the record
		setLocalRecord({
			...localRecord,
			attachments: localRecord.attachments.filter(
				(file) => file.name !== fileName
			),
		});

		// Remove from UI state
		setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
		setFilePreview((prev) => {
			const updated = { ...prev };
			delete updated[fileName];
			return updated;
		});
	};

	const formatFileSize = (bytes: number) => {
		if (typeof bytes === 'string') return bytes;
		if (bytes < 1024) return bytes + ' bytes';
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		else return (bytes / 1048576).toFixed(1) + ' MB';
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0 flex flex-col">
				<DialogHeader className="px-6 py-4 border-b flex-shrink-0">
					<div className="flex flex-col space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm font-medium text-muted-foreground mb-1">
									Medical Record
								</div>
								<DialogTitle className="text-2xl">
									{localRecord.patient}
								</DialogTitle>
								<div className="text-sm text-muted-foreground mt-1">
									Date of Birth: {formatDate(localRecord.patientDateOfBirth)}
								</div>
							</div>
							<div>
								{!isEditMode && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditMode(true)}
									>
										<Edit className="mr-2 h-4 w-4" />
										Edit Record
									</Button>
								)}
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge
									className={cn(
										'font-medium px-3 py-1 hover:opacity-100',
										typeVariants[localRecord.type as keyof typeof typeVariants]
									)}
								>
									{getTypeTranslation(localRecord.type)}
								</Badge>
								<Badge
									variant={getStatusBadgeVariant(localRecord.status)}
									className="hover:opacity-100"
								>
									{getStatusTranslation(localRecord.status)}
								</Badge>
							</div>
							<div className="flex items-center gap-4 text-sm">
								<span className="text-muted-foreground">
									Record Date: {formatDate(localRecord.date)}
								</span>
								{!isEditMode && (
									<>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setTranscriptionDialogOpen(true)}
											className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
										>
											<Mic className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
											<span className="text-blue-600 dark:text-blue-400">
												Record Session
											</span>
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleExportToPDF}
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
														{t('medicalRecords.export')}
													</span>
												</>
											) : (
												<>
													<FilePdf className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
													<span className="text-red-600 dark:text-red-400">
														{t('medicalRecords.export')}
													</span>
												</>
											)}
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					<div className="space-y-6" id="medical-record-content">
						{isEditMode ? (
							<Form {...form}>
								<div className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="type"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Record Type</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select record type" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="consultation">
																Consultation
															</SelectItem>
															<SelectItem value="examination">
																Examination
															</SelectItem>
															<SelectItem value="procedure">
																Procedure
															</SelectItem>
															<SelectItem value="test">Test Results</SelectItem>
															<SelectItem value="followup">
																Follow-up
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
													<FormLabel>Status</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="notstarted">
																Not Started
															</SelectItem>
															<SelectItem value="onhold">On Hold</SelectItem>
															<SelectItem value="pending">Pending</SelectItem>
															<SelectItem value="completed">
																Completed
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex justify-between items-center mb-2 border-b pb-2">
										<h3 className="text-base font-medium">Other sections</h3>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm">
													<Plus className="h-4 w-4 mr-1" />
													Manage sections
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

									<FormField
										control={form.control}
										name="showVitals"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mb-4 bg-muted/20">
												<div className="space-y-0.5">
													<FormLabel>Vitals and Measurements</FormLabel>
													<FormDescription>
														Show vitals and measurements section
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									{form.watch('showVitals') && (
										<div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
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
								</div>
							</Form>
						) : (
							<>
								{localRecord.showVitals && (
									<div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
										<div>
											<h4 className="font-medium mb-2">Vitals</h4>
											<div className="space-y-1 text-sm">
												<p>
													<span className="text-muted-foreground">
														Blood Pressure:
													</span>{' '}
													{localRecord.vitals.bloodPressure} mmHg
												</p>
												<p>
													<span className="text-muted-foreground">
														Heart Rate:
													</span>{' '}
													{localRecord.vitals.heartRate} bpm
												</p>
												<p>
													<span className="text-muted-foreground">
														Temperature:
													</span>{' '}
													{localRecord.vitals.temperature}°C
												</p>
											</div>
										</div>
										<div>
											<h4 className="font-medium mb-2">Measurements</h4>
											<div className="space-y-1 text-sm">
												<p>
													<span className="text-muted-foreground">Weight:</span>{' '}
													{localRecord.vitals.weight} kg
												</p>
												<p>
													<span className="text-muted-foreground">Height:</span>{' '}
													{localRecord.vitals.height} cm
												</p>
											</div>
										</div>
									</div>
								)}
							</>
						)}

						<div className="space-y-6">
							<div>
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">Symptoms</h3>
									{isEditMode && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleEditField('symptoms', localRecord.symptoms)
											}
										>
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
									)}
								</div>
								<div
									className="prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: localRecord.symptoms }}
								/>
							</div>

							<Separator />

							<div>
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">Diagnosis</h3>
									{isEditMode && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleEditField('diagnosis', localRecord.diagnosis)
											}
										>
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
									)}
								</div>
								<div
									className="prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: localRecord.diagnosis }}
								/>
							</div>

							<Separator />

							<div>
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">Treatment Plan</h3>
									{isEditMode && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleEditField('treatment', localRecord.treatment)
											}
										>
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
									)}
								</div>
								<div
									className="prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: localRecord.treatment }}
								/>
							</div>

							<Separator />

							<div>
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">Notes</h3>
									{isEditMode && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleEditField('notes', localRecord.notes)
											}
										>
											<Edit className="h-4 w-4 mr-2" />
											Edit
										</Button>
									)}
								</div>
								<div
									className="prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: localRecord.notes }}
								/>
							</div>

							{localRecord.transcriptions &&
								localRecord.transcriptions.length > 0 && (
									<>
										<Separator />
										<div>
											<h3 className="font-semibold mb-4">
												Session Transcriptions
											</h3>
											<Accordion
												type="single"
												collapsible
												className="space-y-2"
											>
												{localRecord.transcriptions.map((transcription) => (
													<AccordionItem
														key={transcription.id}
														value={transcription.id.toString()}
														className="border rounded-lg px-4"
													>
														<AccordionTrigger className="hover:no-underline">
															<div className="flex justify-between items-center w-full pr-4">
																<h4 className="font-medium text-left">
																	Session on{' '}
																	{format(
																		new Date(transcription.date),
																		'MMMM d, yyyy'
																	)}
																</h4>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																	onClick={(e) => {
																		e.stopPropagation();
																		const tempDiv =
																			document.createElement('div');
																		tempDiv.innerHTML = transcription.content;
																		const plainText =
																			tempDiv.textContent ||
																			tempDiv.innerText ||
																			'';
																		navigator.clipboard.writeText(plainText);
																		toast.success(
																			'Transcription copied to clipboard'
																		);
																	}}
																>
																	<Copy className="h-4 w-4" />
																</Button>
															</div>
														</AccordionTrigger>
														<AccordionContent>
															<div
																className="prose prose-sm max-w-none pt-2"
																dangerouslySetInnerHTML={{
																	__html: transcription.content,
																}}
															/>
														</AccordionContent>
													</AccordionItem>
												))}
											</Accordion>
										</div>
									</>
								)}

							{localRecord.attachments.length > 0 && (
								<>
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-background px-2 text-muted-foreground">
												Files
											</span>
										</div>
									</div>

									<div className="mt-6">
										{isEditMode && (
											<div className="border-2 border-dashed rounded-lg p-6 mb-6 flex flex-col items-center justify-center bg-muted/30 w-full">
												<Upload className="h-6 w-6 text-muted-foreground mb-2" />
												<p className="text-sm text-muted-foreground mb-1">
													Drag & drop files here or click to browse
												</p>
												<input
													type="file"
													multiple
													className="hidden"
													id="file-upload-edit"
													onChange={handleFileChange}
													accept="image/*,.pdf,.doc,.docx,.txt"
												/>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() =>
														document.getElementById('file-upload-edit')?.click()
													}
												>
													Add files
												</Button>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{localRecord.attachments.map((file, index) => (
												<div
													key={index}
													className="flex items-center p-3 rounded-lg border group hover:bg-accent/50 transition-colors"
												>
													<div className="flex items-center gap-3 flex-1 min-w-0">
														{file.type === 'image' ? (
															<div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center">
																<Image className="h-5 w-5 text-blue-500" />
															</div>
														) : (
															<div className="h-10 w-10 rounded bg-red-50 flex items-center justify-center">
																<FilePdf className="h-5 w-5 text-red-500" />
															</div>
														)}
														<div className="flex-1 min-w-0">
															<p className="font-medium truncate">
																{file.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{file.size}
															</p>
														</div>
													</div>
													<div className="flex items-center gap-1">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handlePreviewFile(file)}
															className="h-8 w-8"
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleDownload(file.name)}
															className="h-8 w-8"
														>
															<Download className="h-4 w-4" />
														</Button>
														{isEditMode && (
															<Button
																variant="ghost"
																size="icon"
																onClick={() => removeFile(file.name)}
																className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
															>
																<X className="h-4 w-4" />
															</Button>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{isEditMode && (
					<div className="border-t p-4 flex justify-end gap-4">
						<Button
							onClick={handleCancelEdit}
							variant="outline"
							className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
						>
							<X className="mr-2 h-4 w-4" />
							Discard Changes
						</Button>
						<Button
							onClick={handleSaveChanges}
							className="bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
						>
							<Save className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
							<span className="text-green-600 dark:text-green-400">
								Save Changes
							</span>
						</Button>
					</div>
				)}

				<SessionTranscriptionDialog
					open={transcriptionDialogOpen}
					onOpenChange={setTranscriptionDialogOpen}
					onSave={handleSaveTranscription}
					patientName={localRecord.patient}
				/>

				{previewFile && (
					<FilePreviewDialog
						file={previewFile}
						open={filePreviewOpen}
						onOpenChange={setFilePreviewOpen}
						onDownload={handleDownload}
						filePreview={filePreview[previewFile?.name]}
					/>
				)}

				<RichTextEditorModal
					content={editorContent}
					onChange={handleEditorSave}
					title={`Edit ${
						editorFieldName?.charAt(0).toUpperCase() +
							editorFieldName?.slice(1) || ''
					}`}
					open={isEditorOpen}
					onOpenChange={setIsEditorOpen}
				/>
			</DialogContent>
		</Dialog>
	);
}
