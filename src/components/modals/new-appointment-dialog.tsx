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

export function NewAppointmentDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      patientName: "",
      date: "",
      time: "",
      type: "",
      notes: "",
    },
  });

  function onSubmit(data: any) {
    console.log(data);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('appointments.new')}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t('appointments.new')}</DialogTitle>
          <DialogDescription>
            {t('appointments.description')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('patients.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('appointments.patientPlaceholder')} {...field} />
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
                      <FormLabel>{t('appointments.date')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('appointments.time')}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('appointments.type')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('appointments.selectType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checkup">{t('appointments.typeCheckup')}</SelectItem>
                          <SelectItem value="followup">{t('appointments.typeFollowup')}</SelectItem>
                          <SelectItem value="consultation">{t('appointments.typeConsultation')}</SelectItem>
                          <SelectItem value="emergency">{t('appointments.typeEmergency')}</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input placeholder={t('common.notesPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4 flex justify-end">
                  <Button type="submit">{t('appointments.save')}</Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}