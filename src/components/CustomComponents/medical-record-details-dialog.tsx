import { useState, useEffect } from "react";
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
import { FileText, Download, File as FilePdf, Mic, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { cn, typeVariants, statusVariants } from '@/lib/utils';
import { SessionTranscriptionDialog } from "./session-transcription-dialog";
import { FilePreviewDialog } from "./file-preview-dialog";

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
    url?: string;
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

  // Update local record when the prop changes
  useEffect(() => {
    setLocalRecord(record);
  }, [record]);

  const handleDownload = (fileName: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading ${fileName}`);
    toast.success(`Downloading ${fileName}`);
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
        <h1 class="text-2xl font-bold mb-2">${localRecord.patient}</h1>
        <p class="text-muted-foreground">Date of Birth: ${formatDate(localRecord.patientDateOfBirth)}</p>
        <p class="text-muted-foreground">Record Date: ${formatDate(localRecord.date)}</p>
      `;
      content.insertBefore(header, content.firstChild);

      const opt = {
        margin: 1,
        filename: `medical-record-${localRecord.id}.pdf`,
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

  const handleSaveTranscription = (transcription: string) => {
    const newTranscription = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: transcription
    };
    
    const updatedRecord = {
      ...localRecord,
      transcriptions: [
        ...(localRecord.transcriptions || []),
        newTranscription
      ]
    };
    
    setLocalRecord(updatedRecord);
    onSave(updatedRecord);
  };

  const handlePreviewFile = (attachment: typeof localRecord.attachments[0]) => {
    // Create a preview file object
    const previewFileObj = {
      name: attachment.name,
      type: attachment.type,
      // Use a reliable sample PDF for demonstration
      url: attachment.type === 'pdf' 
        ? "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
        : (attachment.url || "")
    };
    
    setPreviewFile(previewFileObj);
    setFilePreviewOpen(true);
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    "font-medium px-3 py-1",
                    typeVariants[localRecord.type as keyof typeof typeVariants]
                  )}
                >
                  {getTypeTranslation(localRecord.type)}
                </Badge>
                <Badge 
                  className={cn(
                    "font-medium px-3 py-1",
                    statusVariants[localRecord.status as keyof typeof statusVariants]
                  )}
                >
                  {getStatusTranslation(localRecord.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Record Date: {formatDate(localRecord.date)}
                </span>
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
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6" id="medical-record-content">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
              <div>
                <h4 className="font-medium mb-2">Vitals</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Blood Pressure:</span>{" "}
                    {localRecord.vitals.bloodPressure} mmHg
                  </p>
                  <p>
                    <span className="text-muted-foreground">Heart Rate:</span>{" "}
                    {localRecord.vitals.heartRate} bpm
                  </p>
                  <p>
                    <span className="text-muted-foreground">Temperature:</span>{" "}
                    {localRecord.vitals.temperature}°C
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Measurements</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Weight:</span>{" "}
                    {localRecord.vitals.weight} kg
                  </p>
                  <p>
                    <span className="text-muted-foreground">Height:</span>{" "}
                    {localRecord.vitals.height} cm
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Symptoms</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: localRecord.symptoms }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: localRecord.diagnosis }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Treatment Plan</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: localRecord.treatment }}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: localRecord.notes }}
                />
              </div>

              {localRecord.transcriptions && localRecord.transcriptions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-4">Session Transcriptions</h3>
                    <div className="space-y-4">
                      {localRecord.transcriptions.map((transcription) => (
                        <div key={transcription.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">
                              Session on {format(new Date(transcription.date), 'MMMM d, yyyy, h:mm a')}
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => {
                              const tempDiv = document.createElement('div');
                              tempDiv.innerHTML = transcription.content;
                              const plainText = tempDiv.textContent || tempDiv.innerText || '';
                              navigator.clipboard.writeText(plainText);
                              toast.success("Transcription copied to clipboard");
                            }}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: transcription.content }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {localRecord.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-4">Attachments</h3>
                    <div className="space-y-2">
                      {localRecord.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent/50 transition-colors"
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
                          <div className="flex items-center gap-1">
                            {(attachment.type === 'pdf' || attachment.type === 'image') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePreviewFile(attachment)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(attachment.name)}
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
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
      </DialogContent>

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
        />
      )}
    </Dialog>
  );
}