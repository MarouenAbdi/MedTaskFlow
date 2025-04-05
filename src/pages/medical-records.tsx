import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { NewMedicalRecordDialog } from '@/modals/new-medical-record-dialog';
import { MedicalRecordDetailsDialog } from '@/modals/medical-record-details-dialog';
import { Badge } from '@/components/ui/badge';
import { cn, typeVariants } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MedicalRecord {
	id: number;
	patient: string;
	patientDateOfBirth: string;
	date: string;
	type: string;
	doctor: string;
	status: string;
	avatar?: string;
	symptoms: string;
	diagnosis: string;
	treatment: string;
	notes: string;
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

// Sample medical records data
const initialRecords: MedicalRecord[] = [
	{
		id: 1,
		patient: 'John Doe',
		patientDateOfBirth: '1980-05-15',
		date: '2024-03-15',
		type: 'consultation',
		doctor: 'Dr. Smith',
		status: 'completed',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format',
		symptoms: '<p>Patient reports persistent headaches and fatigue.</p>',
		diagnosis:
			'<p>Tension headaches due to stress. Blood pressure slightly elevated.</p>',
		treatment:
			'<p>Prescribed Ibuprofen 400mg PRN for headaches. Recommended stress management techniques and regular exercise.</p>',
		notes: '<p>Follow-up in 2 weeks to monitor blood pressure.</p>',
		vitals: {
			bloodPressure: '130/85',
			heartRate: '78',
			temperature: '37.2',
			weight: '75',
			height: '180',
		},
		attachments: [
			{
				name: 'blood_test_results.pdf',
				type: 'pdf',
				size: '1.2 MB',
				url: 'https://www.orimi.com/pdf-test.pdf',
			},
			{
				name: 'chest_xray.jpg',
				type: 'image',
				size: '2.5 MB',
				url: 'https://images.unsplash.com/photo-1516069677018-378971e2d685?w=800&h=600&fit=crop',
			},
		],
		transcriptions: [
			{
				id: 1,
				date: '2024-03-15T10:30:00',
				content:
					"<h3>Initial Consultation - March 15, 2024</h3><p>Patient describes headaches as 'throbbing' and concentrated in the frontal area. Reports increased stress at work and poor sleep patterns. No previous history of migraines. Physical examination shows tension in neck muscles.</p>",
			},
		],
	},
	{
		id: 2,
		patient: 'Sarah Johnson',
		patientDateOfBirth: '1992-08-23',
		date: '2024-03-14',
		type: 'followup',
		doctor: 'Dr. Chen',
		status: 'pending',
		avatar:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&auto=format',
		symptoms:
			'<p>Post-surgery follow-up. Patient reports mild discomfort at incision site.</p>',
		diagnosis: '<p>Normal post-operative healing. No signs of infection.</p>',
		treatment:
			'<p>Continue current medication regimen. Wound care instructions provided.</p>',
		notes: '<p>Recovery progressing as expected. Next follow-up in 1 week.</p>',
		vitals: {
			bloodPressure: '120/80',
			heartRate: '72',
			temperature: '36.8',
			weight: '65',
			height: '165',
		},
		attachments: [
			{
				name: 'surgical_notes.pdf',
				type: 'pdf',
				size: '0.8 MB',
				url: 'https://www.orimi.com/pdf-test.pdf',
			},
			{
				name: 'incision_photo.jpg',
				type: 'image',
				size: '1.7 MB',
				url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
			},
		],
	},
	{
		id: 3,
		patient: 'Michael Chen',
		patientDateOfBirth: '1975-11-30',
		date: '2024-03-13',
		type: 'procedure',
		doctor: 'Dr. Rodriguez',
		status: 'completed',
		avatar:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format',
		symptoms:
			'<p>Severe chest pain and shortness of breath. Patient reports onset during exercise.</p>',
		diagnosis:
			'<p>Acute anxiety attack. ECG normal. No signs of cardiac issues.</p>',
		treatment:
			'<p>Administered anxiolytic medication. Breathing exercises demonstrated.</p>',
		notes: '<p>Referred to psychiatrist for anxiety management.</p>',
		vitals: {
			bloodPressure: '140/90',
			heartRate: '95',
			temperature: '37.0',
			weight: '80',
			height: '175',
		},
		attachments: [
			{
				name: 'ecg_results.pdf',
				type: 'pdf',
				size: '1.5 MB',
				url: 'https://www.orimi.com/pdf-test.pdf',
			},
			{
				name: 'mri_scan.jpg',
				type: 'image',
				size: '3.2 MB',
				url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop',
			},
		],
	},
	{
		id: 4,
		patient: 'Emily Davis',
		patientDateOfBirth: '1985-04-18',
		date: '2024-03-12',
		type: 'consultation',
		doctor: 'Dr. Wilson',
		status: 'completed',
		symptoms:
			'<p>Regular diabetes checkup. Patient reports good compliance with medication.</p>',
		diagnosis: '<p>Type 2 Diabetes - Well controlled</p>',
		treatment:
			'<p>Continue current medication regimen. Diet and exercise plan reviewed.</p>',
		notes: '<p>Next follow-up in 3 months. Blood work shows improvement.</p>',
		vitals: {
			bloodPressure: '125/82',
			heartRate: '76',
			temperature: '36.9',
			weight: '68',
			height: '170',
		},
		attachments: [
			{
				name: 'blood_work.pdf',
				type: 'pdf',
				size: '1.1 MB',
				url: 'https://www.orimi.com/pdf-test.pdf',
			},
		],
	},
];

export function MedicalRecords() {
	const { t } = useTranslation();
	const [records, setRecords] = useState(initialRecords);
	const [selectedRecord, setSelectedRecord] = useState<
		(typeof records)[0] | null
	>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedType, setSelectedType] = useState<string>('all');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [dateRange, setDateRange] = useState<DateRange | undefined>();

	const handleRowClick = (record: (typeof records)[0]) => {
		setSelectedRecord({ ...record });
		setDetailsOpen(true);
	};

	const handleSaveRecord = (updatedRecord: (typeof records)[0]) => {
		setRecords((prevRecords) =>
			prevRecords.map((record) =>
				record.id === updatedRecord.id ? updatedRecord : record
			)
		);
		setSelectedRecord(updatedRecord);
	};

	const filteredRecords = records.filter((record) => {
		// Search filter
		const matchesSearch = searchQuery
			? record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
			  record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
			  record.status.toLowerCase().includes(searchQuery.toLowerCase())
			: true;

		// Type filter
		const matchesType = selectedType === 'all' || record.type === selectedType;

		// Status filter
		const matchesStatus =
			selectedStatus === 'all' || record.status === selectedStatus;

		// Date range filter
		const recordDate = new Date(record.date);
		const matchesDateRange =
			(!dateRange?.from || recordDate >= dateRange.from) &&
			(!dateRange?.to || recordDate <= dateRange.to);

		return matchesSearch && matchesType && matchesStatus && matchesDateRange;
	});

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

	return (
		<div className="space-y-6">
			<div className="flex items-start gap-4">
				<Avatar className="h-12 w-12 mt-1">
					<AvatarFallback className="bg-blue-100 dark:bg-blue-900/20">
						<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						{t('nav.medicalRecords')}
					</h2>
					<p className="text-muted-foreground">
						{t('medicalRecords.description')}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative w-[300px]">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t('medicalRecords.searchPlaceholder')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>

				<div className="flex items-center gap-4 ml-auto">
					<Select value={selectedType} onValueChange={setSelectedType}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t('medicalRecords.filterByType')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t('medicalRecords.typeAll')}</SelectItem>
							<SelectItem value="consultation">
								{t('medicalRecords.typeConsultation')}
							</SelectItem>
							<SelectItem value="followup">
								{t('medicalRecords.typeFollowup')}
							</SelectItem>
							<SelectItem value="procedure">
								{t('medicalRecords.typeProcedure')}
							</SelectItem>
						</SelectContent>
					</Select>

					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t('medicalRecords.filterByStatus')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								{t('medicalRecords.statusAll')}
							</SelectItem>
							<SelectItem value="completed">
								{t('medicalRecords.statusCompleted')}
							</SelectItem>
							<SelectItem value="pending">
								{t('medicalRecords.statusPending')}
							</SelectItem>
							<SelectItem value="notstarted">
								{t('medicalRecords.statusNotStarted')}
							</SelectItem>
							<SelectItem value="onhold">
								{t('medicalRecords.statusOnHold')}
							</SelectItem>
						</SelectContent>
					</Select>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									'w-[240px] justify-start text-left font-normal',
									!dateRange?.from && 'text-muted-foreground'
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
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
									<span>{t('medicalRecords.filterByDate')}</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<div className="border-b border-border p-3 flex items-center justify-between">
								<p className="text-sm font-medium">
									{t('medicalRecords.selectDateRange')}
								</p>
								{dateRange?.from && (
									<Button
										variant="ghost"
										className="h-8 px-2"
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

					<NewMedicalRecordDialog />
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t('medicalRecords.patient')}</TableHead>
							<TableHead>{t('medicalRecords.date')}</TableHead>
							<TableHead>{t('medicalRecords.type')}</TableHead>
							<TableHead>Vitals</TableHead>
							<TableHead>{t('medicalRecords.status')}</TableHead>
							<TableHead>Attachments</TableHead>
							<TableHead>Transcriptions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredRecords.map((record) => (
							<TableRow
								key={record.id}
								className="cursor-pointer group hover:bg-accent/50 transition-colors"
								onClick={() => handleRowClick(record)}
							>
								<TableCell className="font-medium">
									<div className="flex items-center gap-3">
										<Avatar>
											{record.avatar ? (
												<AvatarImage src={record.avatar} alt={record.patient} />
											) : (
												<AvatarFallback className="bg-primary/10 text-primary/80">
													{record.patient
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											)}
										</Avatar>
										<span className="group-hover:text-primary transition-colors">
											{record.patient}
										</span>
									</div>
								</TableCell>
								<TableCell>{record.date}</TableCell>
								<TableCell>
									<Badge
										className={cn(
											'font-medium',
											typeVariants[record.type as keyof typeof typeVariants]
										)}
									>
										{t(
											`medicalRecords.type${
												record.type.charAt(0).toUpperCase() +
												record.type.slice(1)
											}`
										)}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="text-sm">
										<span className="text-muted-foreground">BP:</span>{' '}
										{record.vitals.bloodPressure}
										<span className="mx-2">|</span>
										<span className="text-muted-foreground">HR:</span>{' '}
										{record.vitals.heartRate}
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={getStatusBadgeVariant(record.status)}>
										{t(
											`medicalRecords.status${
												record.status.charAt(0).toUpperCase() +
												record.status.slice(1)
											}`
										)}
									</Badge>
								</TableCell>
								<TableCell>
									{record.attachments && record.attachments.length > 0 ? (
										<Badge
											variant="outline"
											className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800"
										>
											{record.attachments.length}{' '}
											{record.attachments.length === 1 ? 'File' : 'Files'}
										</Badge>
									) : (
										<span className="text-muted-foreground text-sm">None</span>
									)}
								</TableCell>
								<TableCell>
									{record.transcriptions && record.transcriptions.length > 0 ? (
										<Badge
											variant="outline"
											className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800"
										>
											{record.transcriptions.length}{' '}
											{record.transcriptions.length === 1
												? 'Session'
												: 'Sessions'}
										</Badge>
									) : (
										<span className="text-muted-foreground text-sm">None</span>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{selectedRecord && (
				<MedicalRecordDetailsDialog
					record={selectedRecord}
					open={detailsOpen}
					onOpenChange={setDetailsOpen}
					onSave={handleSaveRecord}
				/>
			)}
		</div>
	);
}
