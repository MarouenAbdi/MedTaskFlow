import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewPatientDialog } from '@/components/modals/new-patient-dialog';
import { PatientDetailsDialog } from '@/components/modals/patient-details-dialog';
import { User } from 'lucide-react';
import { toast } from 'sonner';

// Dummy patient data with a mix of profile pictures and default avatars
const initialPatients = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format',
    age: 45,
    contact: '+1 234 567 890',
    lastVisit: 'March 15, 2024',
    status: 'active',
    email: 'john.doe@example.com',
    dateOfBirth: '1979-03-15',
    gender: 'male',
    address: '123 Main St, New York, NY',
    notes: '<p>Patient has a history of hypertension. Regular checkups required.</p>',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format',
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&auto=format',
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
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (patient: typeof patients[0]) => {
    setSelectedPatient({ ...patient });
    setDetailsOpen(true);
  };

  const handleStatusChange = (newStatus: string, patientId: number) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, status: newStatus }
          : patient
      )
    );
    
    // Also update the selected patient if it's currently being viewed
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? { ...prev, status: newStatus } : null);
    }
    
    toast.success(`Patient status updated to ${newStatus}`);
  };

  const handleSavePatient = (updatedPatient: typeof patients[0]) => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    setSelectedPatient(updatedPatient);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.patients')}</h2>
        <NewPatientDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t('patients.name')}</TableHead>
              <TableHead>{t('patients.age')}</TableHead>
              <TableHead>{t('patients.contact')}</TableHead>
              <TableHead>{t('patients.lastVisit')}</TableHead>
              <TableHead>{t('patients.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow 
                key={patient.id}
                className="cursor-pointer group"
              >
                <TableCell 
                  className="font-medium"
                  onClick={() => handleRowClick(patient)}
                >
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
                <TableCell onClick={() => handleRowClick(patient)}>
                  {patient.age}
                </TableCell>
                <TableCell onClick={() => handleRowClick(patient)}>
                  {patient.contact}
                </TableCell>
                <TableCell onClick={() => handleRowClick(patient)}>
                  {patient.lastVisit}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={patient.status}
                    onValueChange={(value) => handleStatusChange(value, patient.id)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                          {t(`patients.status${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}`)}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <Badge variant="default">
                          {t('patients.statusActive')}
                        </Badge>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <Badge variant="secondary">
                          {t('patients.statusInactive')}
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
        />
      )}
    </div>
  );
}