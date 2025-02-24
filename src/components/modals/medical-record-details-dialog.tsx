import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Paperclip } from "lucide-react";

interface MedicalRecord {
  id: number;
  patient: string;
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

const statusColors = {
  completed: "success",
  pending: "warning",
  cancelled: "destructive"
} as const;

const typeColors = {
  checkup: "default",
  followup: "secondary",
  emergency: "destructive",
  consultation: "primary"
} as const;

export function MedicalRecordDetailsDialog({
  record,
  open,
  onOpenChange,
  onSave,
}: MedicalRecordDetailsDialogProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = (fileName: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading ${fileName}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{record.patient}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={typeColors[record.type as keyof typeof typeColors]}>
                {t(`medicalRecords.type${record.type.charAt(0).toUpperCase() + record.type.slice(1)}`)}
              </Badge>
              <Badge variant={statusColors[record.status as keyof typeof statusColors]}>
                {t(`medicalRecords.status${record.status.charAt(0).toUpperCase() + record.status.slice(1)}`)}
              </Badge>
            </div>
          </div>
          <DialogDescription className="flex items-center justify-between mt-2">
            <span>{record.date}</span>
            <span>{record.doctor}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
          <div className="p-6">
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
                          className="flex items-center justify-between p-2 rounded-lg border group hover:bg-accent/50 transition-colors"
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}