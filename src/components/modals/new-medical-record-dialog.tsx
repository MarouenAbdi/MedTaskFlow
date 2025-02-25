import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { RichTextEditorModal } from "./rich-text-editor-modal";
import { Copy, Trash2 } from 'lucide-react';
import { toast } from "sonner";

interface NewMedicalRecordDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: any) => void;
  withButton?: boolean;
}

export function NewMedicalRecordDialog({ 
  open, 
  onOpenChange, 
  onSave,
  withButton = true 
}: NewMedicalRecordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      patientName: "",
      date: "",
      type: "",
      status: "notstarted",
      symptoms: "",
      diagnosis: "",
      treatment: "",
      notes: "",
      attachments: "",
    },
  });

  function onSubmit(data: any) {
    if (onSave) {
      onSave(data);
    }
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
    form.reset();
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
    if (!newOpen) {
      form.reset();
    }
  };

  const extractTextFromHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const RichTextField = ({ name, label }: { name: string, label: string }) => {
    const [editorOpen, setEditorOpen] = useState(false);
    
    const handleCopy = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const content = form.getValues(name);
      const plainText = extractTextFromHtml(content);
      navigator.clipboard.writeText(plainText).then(() => {
        toast.success("Content copied to clipboard");
      });
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.setValue(name, "");
    };

    const handleFieldClick = () => {
      setEditorOpen(true);
    };

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <div 
                  role="button"
                  tabIndex={0}
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm pr-28 cursor-pointer hover:bg-accent/50 transition-colors"
                  dangerouslySetInnerHTML={{ __html: field.value }}
                  onClick={handleFieldClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleFieldClick();
                    }
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <RichTextEditorModal
                    content={field.value}
                    onChange={field.onChange}
                    title={label}
                    open={editorOpen}
                    onOpenChange={setEditorOpen}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {withButton && !open && (
        <DialogTrigger asChild>
          <Button>{t('medicalRecords.new')}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t('medicalRecords.new')}</DialogTitle>
          <DialogDescription>
            {t('medicalRecords.description')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('patients.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('patients.namePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('medicalRecords.date')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('medicalRecords.type')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('medicalRecords.selectType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="consultation">{t('medicalRecords.typeConsultation')}</SelectItem>
                            <SelectItem value="examination">{t('medicalRecords.typeExamination')}</SelectItem>
                            <SelectItem value="procedure">{t('medicalRecords.typeProcedure')}</SelectItem>
                            <SelectItem value="test">{t('medicalRecords.typeTest')}</SelectItem>
                            <SelectItem value="followup">{t('medicalRecords.typeFollowup')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('medicalRecords.status')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('medicalRecords.selectStatus')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="notstarted">
                              {t('medicalRecords.statusNotStarted')}
                            </SelectItem>
                            <SelectItem value="onhold">
                              {t('medicalRecords.statusOnHold')}
                            </SelectItem>
                            <SelectItem value="pending">
                              {t('medicalRecords.statusPending')}
                            </SelectItem>
                            <SelectItem value="completed">
                              {t('medicalRecords.statusCompleted')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <RichTextField 
                  name="symptoms" 
                  label={t('medicalRecords.symptoms')} 
                />
                <RichTextField 
                  name="diagnosis" 
                  label={t('medicalRecords.diagnosis')} 
                />
                <RichTextField 
                  name="treatment" 
                  label={t('medicalRecords.treatment')} 
                />
                <RichTextField 
                  name="notes" 
                  label={t('common.notes')} 
                />

                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('medicalRecords.attachments')}</FormLabel>
                      <FormControl>
                        <Input type="file" multiple {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit">{t('medicalRecords.save')}</Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}