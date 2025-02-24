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

export function NewInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      patientName: "",
      service: "",
      amount: "",
      dueDate: "",
      paymentMethod: "",
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
        <Button>{t('invoices.new')}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{t('invoices.new')}</DialogTitle>
          <DialogDescription>
            {t('invoices.description')}
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
                        <Input placeholder={t('invoices.patientPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invoices.service')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('invoices.selectService')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="consultation">{t('invoices.serviceConsultation')}</SelectItem>
                          <SelectItem value="treatment">{t('invoices.serviceTreatment')}</SelectItem>
                          <SelectItem value="procedure">{t('invoices.serviceProcedure')}</SelectItem>
                          <SelectItem value="medication">{t('invoices.serviceMedication')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invoices.amount')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t('invoices.amountPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invoices.dueDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invoices.paymentMethod')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('invoices.selectPaymentMethod')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="card">{t('invoices.paymentCard')}</SelectItem>
                          <SelectItem value="cash">{t('invoices.paymentCash')}</SelectItem>
                          <SelectItem value="insurance">{t('invoices.paymentInsurance')}</SelectItem>
                          <SelectItem value="bank">{t('invoices.paymentBank')}</SelectItem>
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
                  <Button type="submit">{t('invoices.save')}</Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}