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
import { Badge } from '@/components/ui/badge';
import { NewInvoiceDialog } from '@/components/modals/new-invoice-dialog';
import { InvoiceDetailsDialog } from '@/components/modals/invoice-details-dialog';
import { cn, invoiceStatusVariants } from '@/lib/utils';

// Sample invoices data
const initialInvoices = [
  {
    id: 1,
    number: "INV-001",
    patient: "John Doe",
    date: "2024-03-15",
    dueDate: "2024-04-15",
    amount: 150.00,
    status: "paid",
    items: [
      {
        description: "General Consultation",
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00
      },
      {
        description: "Blood Test",
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00
      }
    ],
    subtotal: 150.00,
    tax: 0,
    total: 150.00,
    paymentMethod: "Credit Card"
  },
  {
    id: 2,
    number: "INV-002",
    patient: "Sarah Johnson",
    date: "2024-03-14",
    dueDate: "2024-04-14",
    amount: 350.00,
    status: "processing",
    items: [
      {
        description: "Specialist Consultation",
        quantity: 1,
        unitPrice: 200.00,
        total: 200.00
      },
      {
        description: "X-Ray",
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00
      }
    ],
    subtotal: 350.00,
    tax: 0,
    total: 350.00,
    paymentMethod: "Insurance"
  },
  {
    id: 3,
    number: "INV-003",
    patient: "Michael Chen",
    date: "2024-03-13",
    dueDate: "2024-04-13",
    amount: 275.00,
    status: "waiting",
    items: [
      {
        description: "Follow-up Consultation",
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00
      },
      {
        description: "Prescription",
        quantity: 1,
        unitPrice: 125.00,
        total: 125.00
      }
    ],
    subtotal: 275.00,
    tax: 0,
    total: 275.00,
    notes: "Patient requested itemized receipt for insurance claim"
  }
];

export function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
              <TableHead className="text-right">{t('invoices.amount')}</TableHead>
              <TableHead>{t('invoices.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer group hover:bg-accent/50 transition-colors"
                onClick={() => handleRowClick(invoice)}
              >
                <TableCell className="font-medium group-hover:text-primary transition-colors">
                  {invoice.number}
                </TableCell>
                <TableCell>{invoice.patient}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>
                  <Badge 
                    className={cn(
                      "font-medium",
                      invoiceStatusVariants[invoice.status as keyof typeof invoiceStatusVariants]
                    )}
                  >
                    {t(`invoices.status${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedInvoice && (
        <InvoiceDetailsDialog
          invoice={selectedInvoice}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </div>
  );
}