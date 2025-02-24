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

export function MedicalRecords() {
  const { t } = useTranslation();

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
              <TableHead>{t('medicalRecords.doctor')}</TableHead>
              <TableHead>{t('medicalRecords.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">John Doe</TableCell>
              <TableCell>March 15, 2024</TableCell>
              <TableCell>{t('medicalRecords.typeCheckup')}</TableCell>
              <TableCell>Dr. Smith</TableCell>
              <TableCell>{t('medicalRecords.statusCompleted')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}