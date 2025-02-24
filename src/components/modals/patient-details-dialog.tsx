import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { Copy, Trash2, User } from 'lucide-react';
import { RichTextEditorModal } from "./rich-text-editor-modal";
import { ImagePreviewDialog } from "./image-preview-dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Patient {
  id: number;
  name: string;
  avatar?: string;
  age: number;
  contact: string;
  lastVisit: string;
  status: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  notes?: string;
}

interface PatientDetailsDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patient: Patient) => void;
}

export function PatientDetailsDialog({ 
  patient, 
  open, 
  onOpenChange,
  onSave,
}: PatientDetailsDialogProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(patient.avatar || "");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      ...patient,
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender || "",
      address: patient.address || "",
      email: patient.email || "",
      notes: patient.notes || "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && form.formState.isDirty) {
      setShowAlert(true);
    } else {
      onOpenChange(newOpen);
    }
  };

  function onSubmit(data: any) {
    onSave({ ...patient, ...data });
    onOpenChange(false);
  }

  const handleDiscardChanges = () => {
    setShowAlert(false);
    onOpenChange(false);
    form.reset();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (avatarPreview) {
      setIsImagePreviewOpen(true);
    }
  };

  const extractTextFromHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleCopyNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const notes = form.getValues('notes');
    const plainText = extractTextFromHtml(notes);
    navigator.clipboard.writeText(plainText).then(() => {
      toast.success("Notes copied to clipboard");
    });
  };

  const handleClearNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    form.setValue('notes', '', { shouldDirty: true });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{t('patients.details')}</DialogTitle>
            <DialogDescription>
              {t('patients.detailsDescription')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="space-y-2 text-center">
                      <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-black/50 z-0" />
                        <Avatar 
                          className={cn(
                            "w-24 h-24",
                            avatarPreview && "cursor-pointer hover:opacity-80 transition-opacity"
                          )}
                          onClick={handleAvatarClick}
                        >
                          {avatarPreview ? (
                            <AvatarFallback 
                              className="bg-cover bg-center" 
                              style={{ backgroundImage: `url(${avatarPreview})` }}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              <User className="h-12 w-12 text-primary/80" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="avatar-upload"
                          onChange={handleAvatarChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="text-sm"
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                          {t('patients.changePhoto')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.fullName')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.phone')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.dateOfBirth')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('patients.gender')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('patients.selectGender')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">{t('patients.genderMale')}</SelectItem>
                              <SelectItem value="female">{t('patients.genderFemale')}</SelectItem>
                              <SelectItem value="other">{t('patients.genderOther')}</SelectItem>
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
                          <FormLabel>{t('patients.status')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">{t('patients.statusActive')}</SelectItem>
                              <SelectItem value="inactive">{t('patients.statusInactive')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('patients.address')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.notes')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div 
                              role="button"
                              tabIndex={0}
                              className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm pr-28 cursor-pointer hover:bg-accent/50 transition-colors"
                              dangerouslySetInnerHTML={{ __html: field.value }}
                              onClick={() => setIsEditorOpen(true)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setIsEditorOpen(true);
                                }
                              }}
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleCopyNotes}
                                className="h-8 w-8"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleClearNotes}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <RichTextEditorModal
                                content={field.value}
                                onChange={field.onChange}
                                title={t('common.notes')}
                                open={isEditorOpen}
                                onOpenChange={setIsEditorOpen}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('common.save')}</Button>
                  </div>
                </form>
              </Form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.unsavedChanges')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.unsavedChangesDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              {t('common.continueEditing')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges}>
              {t('common.discardChanges')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {avatarPreview && (
        <ImagePreviewDialog
          src={avatarPreview}
          alt={form.getValues('name')}
          open={isImagePreviewOpen}
          onOpenChange={setIsImagePreviewOpen}
        />
      )}
    </>
  );
}