import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { NewMedicalRecordDialog } from '@/components/modals/new-medical-record-dialog';
import { MedicalRecordDetailsDialog } from '@/components/modals/medical-record-details-dialog';
import { Badge } from '@/components/ui/badge';
import { cn, typeVariants, statusVariants } from '@/lib/utils';

// Sample medical records data
const initialRecords = [
  {
    id: 1,
    patient: "John Doe",
    patientDateOfBirth: "1980-05-15",
    date: "2024-03-15",
    type: "consultation",
    doctor: "Dr. Smith",
    status: "completed",
    symptoms: "<p>Patient reports persistent headaches and fatigue.</p>",
    diagnosis: "<p>Tension headaches due to stress. Blood pressure slightly elevated.</p>",
    treatment: "<p>Prescribed Ibuprofen 400mg PRN for headaches. Recommended stress management techniques and regular exercise.</p>",
    notes: "<p>Follow-up in 2 weeks to monitor blood pressure.</p>",
    vitals: {
      bloodPressure: "130/85",
      heartRate: "78",
      temperature: "37.2",
      weight: "75",
      height: "180"
    },
    attachments: [
      {
        name: "blood_test_results.pdf",
        type: "pdf",
        size: "1.2 MB"
      },
      {
        name: "chest_xray.jpg",
        type: "image",
        size: "2.5 MB"
      }
    ]
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    patientDateOfBirth: "1992-08-23",
    date: "2024-03-14",
    type: "followup",
    doctor: "Dr. Chen",
    status: "pending",
    symptoms: "<p>Post-surgery follow-up. Patient reports mild discomfort at incision site.</p>",
    diagnosis: "<p>Normal post-operative healing. No signs of infection.</p>",
    treatment: "<p>Continue current medication regimen. Wound care instructions provided.</p>",
    notes: "<p>Recovery progressing as expected. Next follow-up in 1 week.</p>",
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "36.8",
      weight: "65",
      height: "165"
    },
    attachments: [
      {
        name: "surgical_notes.pdf",
        type: "pdf",
        size: "0.8 MB"
      }
    ]
  },
  {
    id: 3,
    patient: "Michael Chen",
    patientDateOfBirth: "1975-11-30",
    date: "2024-03-13",
    type: "procedure",
    doctor: "Dr. Rodriguez",
    status: "completed",
    symptoms: "<p>Severe chest pain and shortness of breath. Patient reports onset during exercise.</p>",
    diagnosis: "<p>Acute anxiety attack. ECG normal. No signs of cardiac issues.</p>",
    treatment: "<p>Administered anxiolytic medication. Breathing exercises demonstrated.</p>",
    notes: "<p>Referred to psychiatrist for anxiety management.</p>",
    vitals: {
      bloodPressure: "140/90",
      heartRate: "95",
      temperature: "37.0",
      weight: "80",
      height: "175"
    },
    attachments: [
      {
        name: "ecg_results.pdf",
        type: "pdf",
        size: "1.5 MB"
      }
    ]
  }
];

export function MedicalRecords() {
  const { t } = useTranslation();
  const [records, setRecords] = useState(initialRecords);
  const [selectedRecord, setSelectedRecord] = useState<typeof records[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (record: typeof records[0]) => {
    setSelectedRecord({ ...record });
    setDetailsOpen(true);
  };

  const handleSaveRecord = (updatedRecord: typeof records[0]) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    setSelectedRecord(updatedRecord);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.medicalRecords')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="search" placeholder={t('common.search')} />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow 
                key={record.id}
                className="cursor-pointer group hover:bg-accent/50 transition-colors"
                onClick={() => handleRowClick(record)}
              >
                <TableCell className="font-medium group-hover:text-primary transition-colors">
                  {record.patient}
                </TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Badge className={cn("font-medium", typeVariants[record.type as keyof typeof typeVariants])}>
                    {t(`medicalRecords.type${record.type.charAt(0).toUpperCase() + record.type.slice(1)}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <span className="text-muted-foreground">BP:</span> {record.vitals.bloodPressure}
                    <span className="mx-2">|</span>
                    <span className="text-muted-foreground">HR:</span> {record.vitals.heartRate}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("font-medium", statusVariants[record.status as keyof typeof statusVariants])}>
                    {t(`medicalRecords.status${record.status.charAt(0).toUpperCase() + record.status.slice(1)}`)}
                  </Badge>
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