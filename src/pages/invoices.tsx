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
import { NewInvoiceDialog } from '@/components/modals/new-invoice-dialog';

export function Invoices() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.invoices')}</h2>
        <NewInvoiceDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('invoices.number')}</TableHead>
              <TableHead>{t('invoices.patient')}</TableHead>
              <TableHead>{t('invoices.date')}</TableHead>
              <TableHead>{t('invoices.amount')}</TableHead>
              <TableHead>{t('invoices.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#INV-001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>March 15, 2024</TableCell>
              <TableCell>$150.00</TableCell>
              <TableCell>{t('invoices.statusPaid')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}