import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Copy, Trash2, User, Edit, Save, X } from 'lucide-react';
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
import { Separator } from "@/components/ui/separator";

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
  onStatusChange?: (status: string, id: number) => void;
}

export function PatientDetailsDialog({ 
  patient, 
  open, 
  onOpenChange,
  onSave,
  onStatusChange,
}: PatientDetailsDialogProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(patient.avatar || "");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  // Update form when patient prop changes
  useEffect(() => {
    form.reset({
      ...patient,
      dateOfBirth: patient.dateOfBirth || "",
      gender: patient.gender || "",
      address: patient.address || "",
      email: patient.email || "",
      notes: patient.notes || "",
    });
    setAvatarPreview(patient.avatar || "");
  }, [patient, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && form.formState.isDirty && isEditMode) {
      setShowAlert(true);
    } else {
      onOpenChange(newOpen);
      setIsEditMode(false);
    }
  };

  function onSubmit(data: any) {
    const updatedPatient = { ...patient, ...data };
    onSave(updatedPatient);
    
    // If the status was changed and we have a status change handler
    if (data.status !== patient.status && onStatusChange) {
      onStatusChange(data.status, patient.id);
    }
    
    setIsEditMode(false);
    onOpenChange(false);
    toast.success("Patient information updated successfully");
  }

  const handleDiscardChanges = () => {
    setShowAlert(false);
    setIsEditMode(false);
    form.reset();
  };

  const handleCancelEdit = () => {
    if (form.formState.isDirty) {
      setShowAlert(true);
    } else {
      setIsEditMode(false);
      form.reset();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", reader.result as string, { shouldDirty: true });
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

  const handleCopyNotes = () => {
    const notes = form.getValues('notes');
    const plainText = extractTextFromHtml(notes);
    navigator.clipboard.writeText(plainText).then(() => {
      toast.success("Notes copied to clipboard");
    });
  };

  const handleClearNotes = () => {
    form.setValue('notes', '', { shouldDirty: true });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Patient Record
                  </div>
                  <DialogTitle className="text-2xl">
                    {patient.name}
                  </DialogTitle>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={patient.status === 'active' ? 'success' : 'destructive'}>
                    {t(`patients.status${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}`)}
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={isEditMode ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/20 dark:text-blue-300 dark:hover:bg-blue-800/30" : ""}
                >
                  {isEditMode ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel Edit
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex justify-center mb-6">
                <div className="space-y-2 text-center">
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                    <Avatar 
                      className={cn(
                        "w-24 h-24",
                        avatarPreview && "cursor-pointer hover:opacity-80 transition-opacity"
                      )}
                      onClick={handleAvatarClick}
                    >
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt={patient.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10">
                          <User className="h-12 w-12 text-primary/80" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  {isEditMode && (
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
                  )}
                </div>
              </div>
              
              <Separator />
              
              <Form {...form}>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  {isEditMode ? (
                    <>
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
                                    <SelectValue>
                                      <Badge variant={field.value === 'active' ? 'success' : 'destructive'}>
                                        {t(`patients.status${field.value.charAt(0).toUpperCase() + field.value.slice(1)}`)}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">
                                    <Badge variant="success">
                                      {t('patients.statusActive')}
                                    </Badge>
                                  </SelectItem>
                                  <SelectItem value="inactive">
                                    <Badge variant="destructive">
                                      {t('patients.statusInactive')}
                                    </Badge>
                                  </SelectItem>
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
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                          <p>{patient.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                          <p>{patient.email || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                          <p>{patient.contact}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                          <p>{patient.dateOfBirth || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                          <p>{patient.gender ? t(`patients.gender${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`) : "Not provided"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Last Visit</h4>
                          <p>{patient.lastVisit}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                        <p>{patient.address || "Not provided"}</p>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{t('common.notes')}</h3>
                      {isEditMode && (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyNotes}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearNotes}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditorOpen(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                    <div 
                      className="prose prose-sm max-w-none p-4 bg-muted/20 rounded-lg min-h-[100px]"
                      dangerouslySetInnerHTML={{ __html: form.getValues('notes') || '<p class="text-muted-foreground">No notes available</p>' }}
                    />
                  </div>
                </div>
              </Form>
            </div>
          </div>
          {isEditMode && (
            <div className="border-t p-4 flex justify-end">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
              >
                <Save className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">
                  Save Changes
                </span>
              </Button>
            </div>
          )}
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
      
      <RichTextEditorModal
        content={form.getValues('notes') || ''}
        onChange={(content) => form.setValue('notes', content, { shouldDirty: true })}
        title="Edit Notes"
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
      />
    </>
  );
}