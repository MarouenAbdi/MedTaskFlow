import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, File as FilePdf } from "lucide-react";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { cn, typeVariants, statusVariants } from '@/lib/utils';

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

  const handleDownload = (fileName: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading ${fileName}`);
  };

  const getTypeTranslation = (type: string) => {
    return t(`medicalRecords.type${type.charAt(0).toUpperCase() + type.slice(1)}`);
  };

  const getStatusTranslation = (status: string) => {
    return t(`medicalRecords.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
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
        <h1 class="text-2xl font-bold mb-2">${record.patient}</h1>
        <p class="text-muted-foreground">Date of Birth: ${formatDate(record.patientDateOfBirth)}</p>
        <p class="text-muted-foreground">Record Date: ${formatDate(record.date)}</p>
      `;
      content.insertBefore(header, content.firstChild);

      const opt = {
        margin: 1,
        filename: `medical-record-${record.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Medical Record
                </div>
                <DialogTitle className="text-2xl">
                  {record.patient}
                </DialogTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  Date of Birth: {formatDate(record.patientDateOfBirth)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    "font-medium px-3 py-1",
                    typeVariants[record.type as keyof typeof typeVariants]
                  )}
                >
                  {getTypeTranslation(record.type)}
                </Badge>
                <Badge 
                  className={cn(
                    "font-medium px-3 py-1",
                    statusVariants[record.status as keyof typeof statusVariants]
                  )}
                >
                  {getStatusTranslation(record.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Record Date: {formatDate(record.date)}
                </span>
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
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4" id="medical-record-content">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
              <div>
                <h4 className="font-medium mb-2">Vitals</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Blood Pressure:</span>{" "}
                    {record.vitals.bloodPressure} mmHg
                  </p>
                  <p>
                    <span className="text-muted-foreground">Heart Rate:</span>{" "}
                    {record.vitals.heartRate} bpm
                  </p>
                  <p>
                    <span className="text-muted-foreground">Temperature:</span>{" "}
                    {record.vitals.temperature}°C
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Measurements</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Weight:</span>{" "}
                    {record.vitals.weight} kg
                  </p>
                  <p>
                    <span className="text-muted-foreground">Height:</span>{" "}
                    {record.vitals.height} cm
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Symptoms</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: record.symptoms }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: record.diagnosis }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Treatment Plan</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: record.treatment }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: record.notes }}
                />
              </div>

              {record.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-4">Attachments</h3>
                    <div className="space-y-2">
                      {record.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-md bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(attachment.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}