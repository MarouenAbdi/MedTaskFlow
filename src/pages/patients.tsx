import { useState, useMemo } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NewPatientDialog } from '@/components/modals/new-patient-dialog';
import { PatientDetailsDialog } from '@/components/modals/patient-details-dialog';
import { User, Search, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Dummy patient data with a mix of profile pictures and default avatars
const initialPatients = [
	{
		id: 1,
		name: 'John Doe',
		avatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format',
		age: 45,
		contact: '+1 234 567 890',
		lastVisit: 'March 15, 2024',
		status: 'active',
		email: 'john.doe@example.com',
		dateOfBirth: '1979-03-15',
		gender: 'male',
		address: '123 Main St, New York, NY',
		notes:
			'<p>Patient has a history of hypertension. Regular checkups required.</p>',
	},
	{
		id: 2,
		name: 'Sarah Johnson',
		age: 32,
		contact: '+1 345 678 901',
		lastVisit: 'March 14, 2024',
		status: 'active',
		email: 'sarah.j@example.com',
		dateOfBirth: '1992-07-22',
		gender: 'female',
		address: '456 Oak Ave, Boston, MA',
		notes: '<p>No significant medical history.</p>',
	},
	{
		id: 3,
		name: 'Michael Chen',
		avatar:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format',
		age: 28,
		contact: '+1 456 789 012',
		lastVisit: 'March 13, 2024',
		status: 'inactive',
		email: 'michael.c@example.com',
		dateOfBirth: '1996-11-30',
		gender: 'male',
		address: '789 Pine St, San Francisco, CA',
		notes: '<p>Allergic to penicillin.</p>',
	},
	{
		id: 4,
		name: 'Emily Davis',
		age: 39,
		contact: '+1 567 890 123',
		lastVisit: 'March 12, 2024',
		status: 'active',
		email: 'emily.d@example.com',
		dateOfBirth: '1985-04-18',
		gender: 'female',
		address: '321 Elm St, Chicago, IL',
		notes: '<p>Regular checkups for diabetes management.</p>',
	},
	{
		id: 5,
		name: 'Robert Wilson',
		avatar:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&auto=format',
		age: 52,
		contact: '+1 678 901 234',
		lastVisit: 'March 11, 2024',
		status: 'active',
		email: 'robert.w@example.com',
		dateOfBirth: '1972-09-05',
		gender: 'male',
		address: '654 Maple Dr, Seattle, WA',
		notes: '<p>Recent knee surgery. Physical therapy ongoing.</p>',
	},
];

export function Patients() {
	const { t } = useTranslation();
	const [patients, setPatients] = useState(initialPatients);
	const [selectedPatient, setSelectedPatient] = useState<
		(typeof patients)[0] | null
	>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [ageFilter, setAgeFilter] = useState<string>('all');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const filteredPatients = useMemo(() => {
		return patients
			.filter((patient) => {
				const matchesSearch = patient.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const matchesStatus =
					statusFilter === 'all' || patient.status === statusFilter;

				let matchesAge = true;
				if (ageFilter !== 'all') {
					const age = patient.age;
					switch (ageFilter) {
						case '18-30':
							matchesAge = age >= 18 && age <= 30;
							break;
						case '31-45':
							matchesAge = age >= 31 && age <= 45;
							break;
						case '46-60':
							matchesAge = age >= 46 && age <= 60;
							break;
						case '60+':
							matchesAge = age > 60;
							break;
					}
				}

				return matchesSearch && matchesStatus && matchesAge;
			})
			.sort((a, b) => {
				const dateA = new Date(a.lastVisit);
				const dateB = new Date(b.lastVisit);
				return sortOrder === 'asc'
					? dateA.getTime() - dateB.getTime()
					: dateB.getTime() - dateA.getTime();
			});
	}, [patients, searchQuery, statusFilter, ageFilter, sortOrder]);

	const handleRowClick = (patient: (typeof patients)[0]) => {
		setSelectedPatient({ ...patient });
		setDetailsOpen(true);
	};

	const handleStatusChange = (newStatus: string, patientId: number) => {
		setPatients((prevPatients) =>
			prevPatients.map((patient) =>
				patient.id === patientId ? { ...patient, status: newStatus } : patient
			)
		);

		if (selectedPatient?.id === patientId) {
			setSelectedPatient((prev) =>
				prev ? { ...prev, status: newStatus } : null
			);
		}

		toast.success(`Patient status updated to ${newStatus}`);
	};

	const handleSavePatient = (updatedPatient: (typeof patients)[0]) => {
		setPatients((prevPatients) =>
			prevPatients.map((patient) =>
				patient.id === updatedPatient.id ? updatedPatient : patient
			)
		);
		setSelectedPatient(updatedPatient);
	};

	const toggleSortOrder = () => {
		setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">
					{t('nav.patients')}
				</h2>
				<p className="text-muted-foreground">{t('patients.description')}</p>
			</div>

			<div className="flex justify-between items-center">
				<div className="relative w-[300px]">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t('patients.searchPlaceholder')}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
				<div className="flex items-center gap-4">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t('patients.filterByStatus')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t('patients.statusAll')}</SelectItem>
							<SelectItem value="active">
								{t('patients.statusActive')}
							</SelectItem>
							<SelectItem value="inactive">
								{t('patients.statusInactive')}
							</SelectItem>
						</SelectContent>
					</Select>
					<Select value={ageFilter} onValueChange={setAgeFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={t('patients.filterByAge')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t('patients.ageAll')}</SelectItem>
							<SelectItem value="18-30">18-30 {t('patients.years')}</SelectItem>
							<SelectItem value="31-45">31-45 {t('patients.years')}</SelectItem>
							<SelectItem value="46-60">46-60 {t('patients.years')}</SelectItem>
							<SelectItem value="60+">
								{'> 60'} {t('patients.years')}
							</SelectItem>
						</SelectContent>
					</Select>
					<NewPatientDialog />
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">{t('patients.name')}</TableHead>
							<TableHead>{t('patients.age')}</TableHead>
							<TableHead>{t('patients.contact')}</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									className="p-0 h-8 font-medium"
									onClick={toggleSortOrder}
								>
									{t('patients.lastVisit')}
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>{t('patients.status')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPatients.map((patient) => (
							<TableRow
								key={patient.id}
								className="cursor-pointer group hover:bg-accent/50 transition-colors"
								onClick={() => handleRowClick(patient)}
							>
								<TableCell className="font-medium">
									<div className="flex items-center gap-3">
										<Avatar>
											{patient.avatar ? (
												<AvatarImage src={patient.avatar} alt={patient.name} />
											) : (
												<AvatarFallback className="bg-primary/10">
													<User className="h-5 w-5 text-primary/80" />
												</AvatarFallback>
											)}
										</Avatar>
										<span className="group-hover:text-primary transition-colors">
											{patient.name}
										</span>
									</div>
								</TableCell>
								<TableCell>{patient.age}</TableCell>
								<TableCell>{patient.contact}</TableCell>
								<TableCell>{patient.lastVisit}</TableCell>
								<TableCell>
									<Badge
										variant={
											patient.status === 'active' ? 'success' : 'destructive'
										}
									>
										{t(
											`patients.status${
												patient.status.charAt(0).toUpperCase() +
												patient.status.slice(1)
											}`
										)}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{selectedPatient && (
				<PatientDetailsDialog
					patient={selectedPatient}
					open={detailsOpen}
					onOpenChange={setDetailsOpen}
					onSave={handleSavePatient}
					onStatusChange={handleStatusChange}
				/>
			)}
		</div>
	);
}
