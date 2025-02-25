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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { User } from 'lucide-react';

interface NewPatientDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: any) => void;
  withButton?: boolean;
}

export function NewPatientDialog({ 
  open, 
  onOpenChange, 
  onSave,
  withButton = true 
}: NewPatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      avatar: "",
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
    setAvatarPreview("");
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
    if (!newOpen) {
      form.reset();
      setAvatarPreview("");
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
    }
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {withButton && !open && (
        <DialogTrigger asChild>
          <Button>{t('patients.new')}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t('patients.new')}</DialogTitle>
          <DialogDescription>
            {t('patients.description')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="space-y-2 text-center">
                    <Avatar className="w-24 h-24 mx-auto">
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
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('patients.namePlaceholder')} {...field} />
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
                        <Input type="email" placeholder={t('patients.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('patients.phonePlaceholder')} {...field} />
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('patients.addressPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit">{t('patients.save')}</Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}